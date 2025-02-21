import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
  UPDATE,
} from "../../../../../services/redux/slices/commerce/sales";
import {
  axioKit,
  currency,
  fullName,
  getGenderIcon,
  globalSearch,
  harvestTask,
} from "../../../../../services/utilities";
import DataTable from "../../../../../components/dataTable";
import { capitalize } from "lodash";
import { Categories } from "../../../../../services/fakeDb";
import { useToasts } from "react-toast-notifications";

// old

export default function Sales() {
  const [sales, setSales] = useState([]),
    [view, setView] = useState("all"),
    [total, setTotal] = useState(0),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading, message, isSuccess } = useSelector(
      ({ sales }) => sales
    ),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id)
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const sales =
        view === "all"
          ? collections
          : collections.filter(({ perform }) => perform === view);
      setTotal(sales.reduce((a, c) => a + c.amount, 0));
      setSales(sales);
    }
  }, [collections, view]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setView("all");
      setSales(globalSearch(collections, key));
    } else {
      setSales(collections);
    }
  };

  const generateStub = (sale) => ({
    ...sale,
    customer: {
      fullName: sale.customerId?.fullName,
      address: `${
        sale.customerId?.address?.barangay &&
        `${sale.customerId?.address?.barangay}, `
      }${sale.customerId?.address?.city}`,
    },
    cashier: sale.cashierId?.fullName,
    cart: sale.cart,
  });

  const handleView = (selected) => {
    localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
    window.open(
      "/printout/claimstub",
      "Claim Stub",
      "top=100px,left=100px,width=550px,height=750px"
    );
  };

  const generateTask = async (selected) => {
    for (const sale of selected) {
      const { _id, cart, customerId } = sale;

      const task = harvestTask(cart);
      for (const key in task) {
        const lowercaseKey = key.toLowerCase();

        if (key === "Miscellaneous") {
          // const buntisTests = [68, 69, 70, 131, 97]; // HIV, RPR, HBsAg, HAV, HCV
          const buntisTests = []; // HIV, RPR, HBsAg, HAV, HCV //removed 131
          var tests = task[key];
          // Check if all elements to remove are present in the array
          const buntisPresent = tests.filter((test) =>
            buntisTests.includes(test)
          );

          if (!!buntisPresent.length) {
            tests = tests.filter((item) => !buntisTests.includes(item));
            await axioKit.save(
              "results/laboratory/miscellaneous",
              {
                packages: buntisPresent,
                saleId: _id,
                customerId: customerId?._id,
                branchId: activePlatform?.branchId,
                buntis: true,
              },
              token
            );
            return; // added a return to stop from double query
          }

          // Solo form:
          // 1. Preg test (70),
          // 2. Dengue Duo (77),
          // 3. Blood Typing (66)
          const newArr = tests.map((test) => ({
            packages: [test],
            saleId: _id,
            customerId: customerId?._id,
            branchId: activePlatform?.branchId,
            _buntis: false,
          }));

          axioKit.save("results/laboratory/miscellaneous", newArr, token);

          continue;
        }

        const department =
          key === "ECG" || key === "X-ray" ? "radiology" : "laboratory";

        axioKit.save(
          `results/${department}/${lowercaseKey}`,
          {
            packages: task[key],
            _id,
            customerId: customerId?._id,
            branchId: activePlatform?.branchId,
          },
          token
        );
      }

      dispatch(
        UPDATE({
          token,
          data: {
            _id,
            renderedBy: auth._id,
            renderedAt: new Date().toLocaleString(),
            hasResult: true,
          },
        })
      );
    }
  };

  return (
    <DataTable
      isLoading={isLoading}
      title={`${view === "all" ? "Patient " : capitalize(view)}`}
      array={sales}
      extraActions={[
        {
          _icon: "list",
          _function: () => setView("all"),
          _disabledOnSearch: true,
          _selected: view === "all",
        },
        {
          _icon: "hospital",
          _function: () => setView("inhouse"),
          _disabledOnSearch: true,
          _selected: view === "inhouse",
        },
        {
          _icon: "plane-arrival",
          _function: () => setView("insource"),
          _disabledOnSearch: true,
          _selected: view === "insource",
        },
        {
          _icon: "plane-departure",
          _function: () => setView("sendout"),
          _disabledOnSearch: true,
          _selected: view === "sendout",
        },
      ]}
      actions={[
        {
          _icon: "eye",
          _function: handleView,
          _title: "View",
          _haveSelect: true,
          _allowMultiple: false,
        },
        {
          _icon: "arrow-circle-down",
          _function: generateTask,
          _title: "Generate Task",
          _haveSelect: true,
          _shouldReset: true,
        },
      ]}
      tableHeads={[
        {
          _text: "#",
        },
        {
          _text: "Time Charge",
        },
        {
          _text: "Patient",
        },
        {
          _text: "Category",
          _className: view !== "all" && "d-none",
        },
        {
          _text: "Source",
        },
        {
          _text: "Referral",
        },
        {
          _text: "Time Rendered",
        },
      ]}
      tableBodies={[
        {
          _isEmpty: true,
          _format: (...[, , , reversedPage]) => reversedPage + 1,
        },
        {
          _key: "createdAt",
          _format: (data) => new Date(data).toLocaleTimeString(),
        },
        {
          _key: "customerId",
          _format: ({ isMale, fullName: fullname }) => {
            return (
              <span style={{}}>
                {getGenderIcon(isMale)}
                {fullName(fullname)}
              </span>
            );
          },
        },

        {
          _key: "category",
          _className: view !== "all" && "d-none",
          _format: (data) =>
            capitalize(
              data === "walkin"
                ? data
                : Categories.find(({ abbr }) => abbr === data).name
            ),
        },
        {
          _key: "category",
          _className: view !== "all" && "d-none",
          _isEmpty: true,

          _format: (data) =>
            capitalize(
              data === "walkin"
                ? data
                : Categories.find(({ abbr }) => abbr === data).name
            ),
        },
        {
          _key: "category",
          _className: view !== "all" && "d-none",
          _isEmpty: true,

          _format: (data) =>
            capitalize(
              data === "walkin"
                ? data
                : Categories.find(({ abbr }) => abbr === data).name
            ),
        },
        {
          _key: "renderedAt",
          _isEmpty: true,
          _format: (data) => {
            return (
              <span style={{ backgroundColor: data && "yellow" }}>
                {data && new Date(data).toLocaleTimeString()}
              </span>
            );
          },
        },
      ]}
      handleSearch={handleSearch}
    />
  );
}
