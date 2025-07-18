import React from "react";
import { getPhysicianGenderIcon } from "../getGenderIcon";
import { get } from "lodash";
import fullName from "../fullName";
import { UPDATE_INFO } from "../../redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";

const Deals = {
  getPhysicians: (fk, sources) => {
    const physicians =
      [...sources].find(({ clients }) => clients._id === fk)?.clients
        ?.affiliated || [];

    const physiciansFormmated =
      physicians?.length > 0
        ? [...physicians]?.map(({ user }) => ({
            value: user._id,
            text: React.createElement(
              "div",
              null,
              getPhysicianGenderIcon(user?.isMale),
              fullName(user?.fullName)
            ),
          }))
        : [];

    return physiciansFormmated;
  },

  sourceName: (fk, sources) => {
    console.log(
      "source name",
      [...sources].find(({ clients }) => clients._id === fk)?.clients
        ?.displayname || ""
    );
    return (
      [...sources].find(({ clients }) => clients._id === fk)?.clients
        ?.displayname || ""
    );
  },
  physicianName: (physicianID, sourceID, sources) => {
    const affiiated =
      [...sources].find(({ clients }) => clients?._id === sourceID)?.clients
        ?.affiliated || [];

    return fullName(
      affiiated.find(({ user }) => user._id === physicianID)?.user?.fullName
    );
  },
  specificUpdate: async ({
    updatedKey,
    newKey,
    selected,
    deal = {},
    setSelected,
    dispatch,
    addToast,
    token,
    sources,
  }) => {
    const { physicianId } = deal || {};
    const { _id } = selected;
    const baseUpdateKey = updatedKey.split(".")[0];
    const oldValue = get(selected, updatedKey);
    const newValue = selected[newKey] || "";

    if (String(oldValue)?.toLowerCase() === String(newValue)?.toLowerCase()) {
      setSelected({});
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    var physicianIsReset = false;

    if (baseUpdateKey === "source" && oldValue !== newValue && physicianId) {
      const affiliatedOfNewSource = Deals.getPhysicians(newValue, sources);
      const physicianIsExist = affiliatedOfNewSource.some(
        ({ value }) => value === physicianId._id
      );

      if (!physicianIsExist) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Physician Not Affiliated",
          html: `The physician <b>
           ${Deals.physicianName(
             physicianId._id,
             oldValue,
             sources
           )} </b>  in this deal is not affiliated with the <b>${Deals.sourceName(
            newValue,
            sources
          )}</b> source. If you confirm, the physician will be removed.`,
          showCancelButton: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
          return;
        }

        physicianIsReset = true;
      }
    }

    dispatch(
      UPDATE_INFO({
        data: {
          _id,
          [baseUpdateKey]: selected[newKey],
          updatedKey: baseUpdateKey,
          ...(physicianIsReset && { physicianId: "", resetPhysician: true }),
        },
        token,
      })
    );
  },
};

export default Deals;
