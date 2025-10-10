import { Services } from "../../../../../../services/fakeDb";
import { capitalize } from "../../../../../../services/utilities";
const getCorrectCollections = (obj, activeType, branches) => {
  if (!obj._id) return [];
  const { collections = [] } = obj;
  if (obj.type === activeType) {
    return [...collections];
  } else {
    return [
      ...(branches.find((branch) => branch._id === obj._id)?.[activeType] ||
        []),
    ];
  }
};
const utils = {
  changeTo: (menus, BASE_LENGTH, fromCollections) => {
    const fromLength = fromCollections.length;
    const isMoreThanFrom = menus.length > fromLength;
    const newArray = Array.from(
      { length: isMoreThanFrom ? fromLength : BASE_LENGTH },
      () => ({})
    );
    // Fill matched indices
    menus.forEach((item) => {
      const index = fromCollections.findIndex(
        (f) => utils.getName(f) === utils.getName(item)
      );
      if (index > -1) {
        newArray[index] = item;
      } else {
        newArray.push(item);
      }
    });

    // Push extras to the end
    return newArray;
  },

  changeFrom: (menus = [], BASE_LENGTH = 0) => {
    const length = BASE_LENGTH - menus.length;
    if (length <= 0) return menus;
    return [...menus, ...Array.from({ length }, () => ({}))];
  },

  changeBranch: (
    identifier,
    newBranch,
    clone,
    branches,
    isInitialize = false
  ) => {
    const { from = {}, to = {}, type } = clone;
    const found = branches.find((branch) => branch._id === newBranch) || {};
    const actMenus = found[type] || [];
    const isFrom = identifier === "from";

    const toCollections = utils.sort(
      isFrom ? getCorrectCollections(to, type, branches) : actMenus
    );
    const fromCollections = utils.sort(
      isFrom ? actMenus : getCorrectCollections(from, type, branches)
    );

    const BASE_LENGTH = Math.max(
      [...toCollections]?.length,
      [...fromCollections]?.length,
      0
    );

    const finalToCollections = utils.changeTo(
      toCollections,
      BASE_LENGTH,
      fromCollections
    );
    return {
      ...clone,
      from: {
        ...from,
        collections: utils.changeFrom(
          fromCollections,
          finalToCollections.length
        ),
        ...((isFrom || from.type !== type) && { _id: newBranch, deleted: [] }),
        type,
      },
      to: {
        ...to,
        collections: finalToCollections,
        ...((!isFrom || to.type !== type) &&
          !isInitialize && { _id: newBranch, deleted: [] }),
        type,
      },
    };
  },
  sort: (menus) => {
    const _menus = [...menus].sort((a, b) => {
      const aName = (a?.name || a.abbreviation || "")
        .replace(/[^a-zA-Z0-9\s]/g, "") // remove special chars
        .toLowerCase();
      const bName = (b?.name || b.abbreviation || "")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toLowerCase();

      return aName.localeCompare(bName);
    });

    return utils.removeDuplicate(_menus);
  },
  removeDuplicate: (menus) =>
    menus.filter(
      (item, index, self) =>
        index ===
          self.findIndex((m) => utils.getName(m) === utils.getName(item)) &&
        Object.keys(item).length
    ),

  serialize: (text) => text?.toLowerCase()?.replace(/\s+/g, "").trim(),
  getName: (obj) => utils.serialize(obj?.name || obj?.abbreviation),
  getBranchName: (branchId, branches) => {
    const branch = branches.find((b) => b._id === branchId);
    return capitalize(branch?.name || branch?.displayName);
  },
  findBranch: (branchId, branches) => branches.find((b) => b._id === branchId),
  finalizeItemsOfBranch: (branch, type, newItems = []) => {
    const existingItems = [...(branch[type] || [])];
    if (newItems?.length === 0) return [...existingItems];
    newItems.forEach((obj) => {
      const index = existingItems.findIndex((i) => i._id === obj._id);
      const item =
        type === "services"
          ? { ...obj, ...(Services.find(obj.serviceId) || {}) }
          : obj;
      if (index === -1) existingItems.push(item);
      if (index > -1) {
        if (item?.deletedAt) {
          existingItems.splice(index, 1);
        } else {
          existingItems[index] = item;
        }
      }
    });
    return existingItems;
  },
};

export default utils;
