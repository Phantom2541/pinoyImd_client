import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LEDGER,
  RESET,
} from "../../../../../../services/redux/slices/commerce/sales";
import { currency } from "../../../../../../../services/utilities";

import DataTable from "../../../../../../../components/dataTable";
import { Calendar as calendar } from "../../../../../../../services/fakeDb";
import Calendar from "./modal";
// import Collapse from "./collapse";
import Swal from "sweetalert2";
// import Census from "./census";
import { MDBRow, MDBCol } from "mdbreact";

//old

export default function Ledger() {
  const [sales, setSales] = useState([]),
    [month, setMonth] = useState(new Date().getMonth()),
    [year, setYear] = useState(new Date().getFullYear()),
    [showCalendar, setShowCalendar] = useState(false),
    [page, setPage] = useState(1),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, isLoading, totalPages, totalSale, totalPatient } =
      useSelector(({ sales }) => sales),
    dispatch = useDispatch(),
    { Months } = calendar;

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId && year && month)
      dispatch(
        LEDGER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            start: new Date(year, month, 1),
            end: new Date(year, month + 1, 0, 23, 59, 59, 999),
          },
        })
      );

    // old query (03/02/2024)
    // if (token && activePlatform?.branchId && auth._id && maxPage && page && year)
    // dispatch(
    //   LEDGER({
    //     token,
    //     branchId: activePlatform?.branchId,
    //     cashierId: auth._id,
    //     limit: maxPage,
    //     page,
    //     month: month + 1,
    //     year,
    //   })
    // );

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  //Set fetched data for mapping
  useEffect(() => {
    //console.log(collections);
    setSales(collections);
  }, [collections]);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  //Search function
  const handleSearch = async (willSearch, key) => {
    Swal.fire({
      icon: "info",
      title: "Under Construction.",
      text: "This feature is still being developed.",
    });
    // if (willSearch) {
    //   setSales(globalSearch(collections, key));
    // } else {
    //   setSales(collections);
    // }
  };

  return (
    <>
      <MDBRow>
        <MDBCol>
          <DataTable
            getPage={setPage}
            totalPages={totalPages} //custom total page based on db
            isLoading={isLoading}
            title={`${month >= 0 && `${Months[month]} `}${year} |  ${currency(
              totalSale
            )} @ ${totalPatient} Patients `}
            array={sales}
            actions={[
              {
                _icon: "calendar-alt",
                _function: toggleCalendar,
              },
            ]}
            toggleComponent={true}
            // customComponent={<Collapse sales={sales} page={page} />}
            handleSearch={handleSearch}
          />
        </MDBCol>
        <MDBCol>{/* <Census /> */}</MDBCol>
      </MDBRow>
      <Calendar
        show={showCalendar}
        toggle={toggleCalendar}
        isLoading={isLoading}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />
    </>
  );
}
