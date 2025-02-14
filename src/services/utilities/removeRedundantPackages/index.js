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
    return array;
  }

  const matchIndexes = [];

  for (let index = 0; index < array.length; index++) {
    const {
      packages: menuPackages,
      abbreviation: abbr,
      description: desc,
      referenceId: refId,
      isNew,
    } = array[index];
    var isDuplicate = false;

    for (const service of menuPackages) {
      if (isDuplicate) continue;

      if (packages.find((srvc) => srvc === service)) isDuplicate = true;
    }

    if (isDuplicate && isNew) matchIndexes.push({ refId, abbr, desc });
  }

  if (!!matchIndexes.length) {
    Swal.fire({
      icon: "info",
      title: "Removed Menus",
      text: `${matchIndexes.map(({ desc, abbr }) => abbr || desc).join(", ")}`,
      footer:
        '<i class="text-info">These menus are removed because of duplicate services.</i>',
    });

    const cart = [...array];

    return [
      ...cart.filter(
        ({ referenceId }) =>
          !matchIndexes.some((removeObj) => referenceId === removeObj.refId)
      ),
      obj,
    ];
  }

  return [...array, obj];
};

export default removeRedundantPackages;
