const utils = {
  changeTo: (menus, BASE_LENGTH, fromCollections) => {
    // Create base array
    const newArray = Array.from({ length: BASE_LENGTH }, () => ({}));
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
  changeBranch: (identifier, newBranch, clone, branches) => {
    const { from = {}, to = {} } = clone;
    const { menus: actMenus = [] } =
      branches.find((branch) => branch._id === newBranch) || {};
    const isFrom = identifier === "from";

    const toCollections = utils.removeDummy(isFrom ? to.collections : actMenus);
    const fromCollections = utils.sort(
      utils.removeDummy(isFrom ? actMenus : from.collections)
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

    console.log(
      "fromCollections",
      utils.changeFrom(fromCollections, finalToCollections.length)
    );

    return {
      ...clone,
      from: {
        ...from,
        collections: utils.changeFrom(
          fromCollections,
          finalToCollections.length
        ),
        ...(isFrom && { _id: newBranch }),
      },
      to: {
        ...to,
        collections: finalToCollections,
        ...(!isFrom && { _id: newBranch }),
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
  removeDummy: (arr) => utils.removeDuplicate(utils.sort(arr)),

  serialize: (text) => text?.toLowerCase()?.replace(/\s+/g, "").trim(),
  getName: (obj) => utils.serialize(obj?.name || obj?.abbreviation),
};

export default utils;
