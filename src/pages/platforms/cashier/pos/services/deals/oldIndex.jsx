import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CASHIER,
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import {
  currency,
  fullName,
  getGenderIcon,
  globalSearch,
} from "../../../../../../services/utilities";
import DataTable from "../../../../../../components/dataTable";
import { capitalize } from "lodash";
import { Categories } from "../../../../../../services/fakeDb";
import CashRegister from "../cashier/pos";

export default function Sales() {
  const [sales, setSales] = useState([]),
    [view, setView] = useState("all"),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState({}),
    [showCashRegister, setShowCashRegister] = useState(false),
    // hiding optional items in table head to conserve UI design and avoid crumpled view
    [showSources, setShowSources] = useState(false), // show sources in table head if set to true
    [showPhysicians, setShowPhysicians] = useState(false), // show physicians in table head if set to true
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading, transaction } = useSelector(({ sales }) => sales),
    dispatch = useDispatch();

  //Initial CASHIER
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const today = new Date().setHours(0, 0, 0, 0); //date and time today starting from 00:00 AM

      dispatch(
        CASHIER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            cashierId: auth._id,
            date: today,
          },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const sales =
        view === "all"
          ? collections
          : collections.filter(({ perform }) => perform === view);

      // if any items inside sales has sourceKeyAsDeclared value, show sources in table head
      if (sales.find((s) => s.physicianId)) setShowPhysicians(true);
      if (sales.find((s) => s.source)) setShowSources(true);

      setTotal(sales.reduce((a, c) => a + c.amount, 0));
      setSales(sales);
    }
  }, [collections, view]);

  //Modal toggle
  const toggleCashRegister = () => setShowCashRegister(!showCashRegister);

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
      "top=100px,left=150px,width=450px,height=850px"
    );
  };

  const handleCashRegister = (selected) => {
    setSelected({
      ...selected.customerId,
      category: selected.category,
      saleId: selected._id,
      soldCart: selected.cart,
    });
    toggleCashRegister();
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title={`${
          view === "all" ? "Daily Sales" : capitalize(view)
        } - Total of ${currency(total)}`}
        array={sales}
        extraActions={[
          {
            _icon: "list",
            _function: () => setView("all"),
            _disabledOnSearch: true,
            _selected: view === "all",
            _title: "All",
          },
          {
            _icon: "hospital",
            _function: () => setView("inhouse"),
            _disabledOnSearch: true,
            _selected: view === "inhouse",
            _title: "Inhouse",
          },
          {
            _icon: "plane-arrival",
            _function: () => setView("insource"),
            _disabledOnSearch: true,
            _selected: view === "insource",
            _title: "Insource",
          },
          {
            _icon: "plane-departure",
            _function: () => setView("sendout"),
            _disabledOnSearch: true,
            _selected: view === "sendout",
            _title: "Outsource",
          },
        ]}
        actions={[
          {
            _icon: "receipt",
            _function: handleView,
            _haveSelect: true,
            _allowMultiple: false,
            _title: "View Receipt",
          },
          {
            _icon: "cash-register",
            _function: handleCashRegister,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
            _title: "Add new services",
          },
        ]}
        tableHeads={[
          {
            _text: "Patient Name",
          },
          {
            _text: "Category",
            _className: view !== "all" && "d-none",
          },
          {
            _text: "Time",
          },
          {
            _text: "Amount",
          },
          // {
          //   _text: "Physician",
          //   _condition: () => showPhysicians,
          // },
          // {
          //   _text: "Source",
          //   _condition: () => showSources,
          // },
        ]}
        tableBodies={[
          {
            _key: "customerId",
            _format: ({ isMale, fullName: fullname }) => (
              <>
                {getGenderIcon(isMale)}
                {fullName(fullname)}
              </>
            ),
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
            _key: "createdAt",
            _format: (data) => new Date(data).toLocaleTimeString(),
          },
          {
            _key: "amount",
            _format: currency,
          },
          // {
          //   _key: "physicianId",
          //   _isEmpty: true,
          //   _format: ({ fullName: fullname }) => <>{fullName(fullname)}</>,
          // },
          // {
          //   _key: "source",
          //   _isEmpty: true,
          //   _format: ({ companyName = "" }) => <>{companyName}</>,
          // },
        ]}
        handleSearch={handleSearch}
      />
      <CashRegister
        key={transaction._id}
        show={showCashRegister}
        toggle={toggleCashRegister}
        patient={selected}
      />
    </>
  );
}
