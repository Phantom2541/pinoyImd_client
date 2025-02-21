import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBContainer, MDBSpinner, MDBTypography } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import {
  BROWSE as SOURCELIST,
  RESET as SOURCERESET,
} from "../../../../../services/redux/slices/assets/providers";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import Header from "./header";
import Card from "./card";
import "./index.css";
import { fullNameSearch } from "../../../../../services/utilities";

export default function Sales() {
  const [searchKey, setSearchKey] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [sales, setSales] = useState([]),
    [view, setView] = useState("All"),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ sales }) => sales),
    dispatch = useDispatch();

  //Initial Browse and Fetch Data
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      dispatch(
        BROWSE({
          key: {
            branchId: activePlatform?.branchId,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
          token,
        })
      );
      dispatch(
        SOURCELIST({ token, key: { clients: activePlatform?.branchId } })
      );
      dispatch(
        PHYSICIANS({ key: { branch: activePlatform?.branchId }, token })
      );
    }

    return () => {
      dispatch(RESET());
      dispatch(SOURCERESET());
      dispatch(PHYSICIANRESET());
    };
  }, [token, dispatch, activePlatform, auth]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const _collections = collections.map((c, i) => ({
        ...c,
        page: collections.length - i,
      }));

      if (didSearch) {
        setSales(fullNameSearch(searchKey, _collections, "customerId"));
      } else {
        setSales(
          view === "All"
            ? _collections
            : _collections.filter(
                ({ perform }) => perform === view.toLowerCase()
              )
        );
      }
    }
  }, [collections, view, didSearch, searchKey]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    setDidSearch(!didSearch);
  };

  // const generateTask = async (sale) => {
  //   const { _id, cart, customerId } = sale;
  //   let RequestForm = { customer: sale?.customerId };
  //   const task = harvestTask(cart);

  //   for (const key in task) {
  //     const lowercaseKey = key.toLowerCase();
  //     RequestForm[lowercaseKey] = task[key];

  //     if (key === "Miscellaneous") {
  //       // const buntisTests = [68, 69, 70, 131, 97]; // HIV, RPR, HBsAg, HAV, HCV
  //       const buntisTests = []; // HIV, RPR, HBsAg, HAV, HCV //removed 131
  //       var tests = task[key];
  //       // Check if all elements to remove are present in the array
  //       const buntisPresent = tests.filter((test) =>
  //         buntisTests.includes(test)
  //       );
  //       console.log("Miscellaneous");
  //       if (!!buntisPresent.length) {
  //         console.log("buntisPresent");

  //         tests = tests.filter((item) => !buntisTests.includes(item));
  //         await axioKit.save(
  //           "results/laboratory/miscellaneous",
  //           {
  //             packages: buntisPresent,
  //             saleId: _id,
  //             customerId: customerId?._id,
  //             branchId: activePlatform?.branchId,
  //             buntis: true,
  //           },
  //           token
  //         );
  //         return; // added a return to stop from double query
  //       }

  //       // Solo form:
  //       // 1. Preg test (67),
  //       // 2. Dengue Duo (77),
  //       // 3. Blood Typing (66)
  //       console.log("Solo form");

  //       const newArr = tests.map((test) => ({
  //         packages: [test],
  //         saleId: _id,
  //         customerId: customerId?._id,
  //         branchId: activePlatform?.branchId,
  //         _buntis: false,
  //       }));

  //       axioKit.save("results/laboratory/miscellaneous", newArr, token);

  //       continue;
  //     }
  //     const department =
  //       key === "ECG" || key === "X-ray"
  //         ? "radiology"
  //         : key === "Examination" || key === "Certicifate"
  //         ? "clinic"
  //         : "laboratory";

  //     axioKit.save(
  //       `results/${department}/${lowercaseKey}`,
  //       {
  //         packages: task[key],
  //         _id,
  //         customerId: customerId?._id,
  //         branchId: activePlatform?.branchId,
  //       },
  //       token
  //     );

  //     localStorage.setItem("RequestForm", JSON.stringify(RequestForm));
  //   }

  //   // working request form but not showing anything
  //   window.open(
  //     "/printout/request/form",
  //     "Request Form",
  //     "top=100px,left=100px,width=1050px,height=750px"
  //   );
  //   dispatch(
  //     UPDATE({
  //       token,
  //       data: {
  //         _id,
  //         renderedBy: auth._id,
  //         renderedAt: new Date().toLocaleString(),
  //         hasResult: true,
  //       },
  //     })
  //   );
  // };

  return (
    <MDBContainer fluid>
      <Header
        length={sales.length}
        view={view}
        setView={setView}
        handleSearch={handleSearch}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        didSearch={didSearch}
      />
      <div className="sales-card-wrapper mt-3">
        {!sales.length && !isLoading && (
          <MDBTypography noteColor="info" note>
            Sales are empty
          </MDBTypography>
        )}
        {isLoading ? (
          <div className="text-center mt-5">
            <MDBSpinner />
          </div>
        ) : (
          sales?.map((sale) => (
            <Card
              key={`sale-${sale._id}`}
              sale={sale}
              number={sale.page}
              allView={view === "All"}
            />
          ))
        )}
      </div>
    </MDBContainer>
  );
}
