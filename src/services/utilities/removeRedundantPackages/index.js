import Swal from "sweetalert2";

const removeRedundantPackages = (obj, array = []) => {
  if (!array.length) return [obj];

  const { referenceId, abbreviation, description, packages } = obj;

  const doesExist = array.find((a) => a.referenceId === referenceId);
  if (doesExist) {
    Swal.fire({
      icon: "warning",
      title: "Duplicate Menu",
      text: `${description || abbreviation} is already selected.`,
    });

    return { stop: true };
  }

  const matchIndexes = [];

  for (let index = 0; index < array.length; index++) {
    const {
      packages: menuPackages,
      abbreviation: abbr,
      description: desc,
      referenceId: refId,
      isNew,
      overrideBy,
    } = array[index];
    var isDuplicate = false;

    for (const service of menuPackages) {
      if (isDuplicate) continue;

      if (packages.find((srvc) => srvc === service)) isDuplicate = true;
    }

    if (isDuplicate && isNew && !overrideBy)
      matchIndexes.push({ refId, abbr, desc });
  }

  if (!!matchIndexes.length) {
    const cart = [...array];

    matchIndexes.forEach((element) => {
      const overriden = cart.filter(
        ({ overrideBy = "" }) => overrideBy === element.refId
      );
      //to remove overrideBy Key
      if (overriden.length > 0) {
        overriden.forEach((e) => {
          const index = cart.findIndex((x) => x.referenceId === e.referenceId);
          const { overrideBy, ...rest } = e;
          cart[index] = { ...rest };
        });
      }
    });

    Swal.fire({
      icon: "info",
      title: "Removed Menus",
      text: `${matchIndexes.map(({ desc, abbr }) => abbr || desc).join(", ")}`,
      footer:
        '<i class="text-info">These menus are removed because of duplicate services.</i>',
    });

    return {
      cart: cart.filter(
        ({ referenceId }) =>
          !matchIndexes.some((removeObj) => referenceId === removeObj.refId)
      ),
      obj,
    };
  }

  return { cart: array, obj };
};

export default removeRedundantPackages;
