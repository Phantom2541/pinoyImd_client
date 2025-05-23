import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { capitalize } from "lodash";
import { MDBTable, MDBIcon, MDBBadge, MDBBtnGroup, MDBBtn } from "mdbreact";
import {
  currency,
  Deals,
  fullName,
  getGenderIcon,
  paymentMethod,
} from "../../../../../../../services/utilities";
import { Categories } from "../../../../../../../services/fakeDb";
import {
  SetTOTAL,
  SetFILTERED,
  RESET,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { useToasts } from "react-toast-notifications";
import { Input, Select } from "../../../../../../../components/customizable";
const Tables = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    {
      collections,
      formSubmitted,
      isSuccess,
      activePage,
      total,
      view = "all",
    } = useSelector(({ deals }) => deals),
    { collections: providers } = useSelector(({ providers }) => providers),
    [data, setData] = useState([]),
    [selected, setSelected] = useState({}),
    [providerOptions, setProviderOptions] = useState([]),
    [didHoverID, setDidHoverID] = useState(-1),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      dispatch(RESET());
      setSelected({});
    }
  }, [dispatch, formSubmitted, isSuccess]);

  useEffect(() => {
    if (collections.length > 0) {
      setData(collections);
    }
  }, [collections]);
  useEffect(() => {
    if (providers.length > 0) {
      let _providerOptions = providers.map(({ clients }) => ({
        _id: clients._id,
        text: `${clients?.displayname?.toUpperCase()}`,
      }));

      _providerOptions.unshift({ _id: "", text: "No Source" });

      setProviderOptions(_providerOptions);
    }
  }, [providers]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const _deals =
        view === "all"
          ? collections
          : collections.filter(({ perform }) => perform === view);

      console.log("collections", collections);
      console.log("view", view);
      console.log("deals", _deals);

      // if any items inside deals has sourceKeyAsDeclared value, show sources in table head
      // if (_deals.find((s) => s.physicianId)) setShowPhysicians(true);
      // if (_deals.find((s) => s.source)) setShowSources(true);

      dispatch(SetTOTAL(_deals.reduce((a, c) => a + c.amount, 0)));
      dispatch(SetFILTERED(_deals));
    }
  }, [collections, view, dispatch]);

  // Sample generateStub function

  const handlePrintout = async (selected) => {
    localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
    window.open(
      "/printout/claimstub",
      "Claim Stub",
      "top=100px,left=150px,width=450px,height=850px"
    );
  };

  const handleCashRegister = (selected) => {
    dispatch(
      SetSELECTED({
        ...selected,
        cart: [], // clean and transfer to soldcart for reference
        soldCart: selected.cart,
      })
    );
  };

  const generateStub = ({ customerId, cashierId, cart, ...rest }) => ({
    ...rest,
    customer: {
      fullName: customerId?.fullName,
      address: customerId?.address,
    },
    cashier: cashierId?.fullName,
    cart,
  });

  const handleUpdate = async (updatedKey, newKey, deal = {}) => {
    Deals.specificUpdate({
      updatedKey,
      newKey,
      selected,
      deal,
      setSelected,
      token,
      sources: providers,
      dispatch,
      addToast,
    });
  };

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginTop: "-1.4rem",
        }}
      >
        <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
          {currency(total)}
        </p>
        <div style={{ flex: 1, borderBottom: "1px dashed black" }}></div>
        <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
          @ {collections.length} Patient/s
        </p>
      </div>
      <MDBTable hover>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>SSX</th>
            <th>Physician/Source</th>
            <th>Amount</th>
            <th className="text-center">Services</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData?.map((deal, index) => {
              const { img, text, style } = paymentMethod?.getImage(
                deal.payment
              );
              const { source = {} } = deal || [];
              return (
                <tr
                  key={`deals-${index + 1}`}
                  onMouseEnter={() => setDidHoverID(index)}
                  onMouseLeave={() => setDidHoverID(-1)}
                >
                  <td>
                    <h6>
                      {getGenderIcon(deal?.customerId?.isMale)}{" "}
                      {fullName(deal?.customerId?.fullName)}
                    </h6>
                    {selected._id === deal._id &&
                    selected?.updatedKey === "category" ? (
                      <div
                        style={{ width: "17rem" }}
                        className="mt-3 d-flex align-items-center"
                      >
                        <Select
                          label={"Category"}
                          onChange={(value) =>
                            setSelected({ ...selected, newCategory: value })
                          }
                          handleCheck={() =>
                            handleUpdate("category", "newCategory")
                          }
                          handleClose={() => setSelected({})}
                          formSubmitted={formSubmitted}
                          soloUpdate
                          whitelisted
                          className="m-0 p-0"
                          collections={Categories}
                          preValue={deal.category}
                          keys={"abbr"}
                          values={"name"}
                        />
                      </div>
                    ) : (
                      <MDBBadge
                        color="info"
                        className="mr-2 cursor-pointer"
                        onClick={() =>
                          setSelected({ ...deal, updatedKey: "category" })
                        }
                      >
                        {deal.category === "walkin"
                          ? deal.category
                          : Categories.find(
                              ({ abbr }) => abbr === deal.category
                            ).abbr.toUpperCase()}
                      </MDBBadge>
                    )}
                    @ {new Date(deal?.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    {selected._id === deal._id &&
                    selected?.updatedKey === "ssx" ? (
                      <div
                        style={{ width: "17rem" }}
                        className="mt-3 d-flex align-items-center"
                      >
                        <Input
                          label={"SSX"}
                          selected={selected}
                          onChange={(_key, value) =>
                            setSelected({ ...selected, [_key]: value })
                          }
                          _key="newSSX"
                          handleCheck={() => handleUpdate("ssx", "newSSX")}
                          handleClose={() => setSelected({})}
                          formSubmitted={formSubmitted}
                          isSuccess={isSuccess}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ) : (
                      <span
                        className="cursor-pointer"
                        style={{ fontWeight: 400 }}
                        onClick={() =>
                          setSelected({
                            ...deal,
                            updatedKey: "ssx",
                            newSSX: deal.ssx,
                          })
                        }
                      >
                        {deal.ssx || "--"}
                      </span>
                    )}
                  </td>
                  <td>
                    {selected?._id === deal?._id &&
                    selected.updatedKey === "source" ? (
                      <div
                        style={{
                          width: "17rem",
                          marginBottom: "-0.7rem",
                        }}
                        className="mt-2 d-flex align-items-center"
                      >
                        <Select
                          label={"Source"}
                          onChange={(value) =>
                            setSelected({ ...selected, newSource: value })
                          }
                          handleCheck={() =>
                            handleUpdate("source._id", "newSource", deal)
                          }
                          handleClose={() => setSelected({})}
                          whitelisted
                          soloUpdate
                          className="m-0 p-0 mt-3"
                          collections={providerOptions}
                          preValue={source?._id}
                          formSubmitted={formSubmitted}
                          keys={"_id"}
                          values={"text"}
                        />
                      </div>
                    ) : (
                      <div>
                        <small className="mr-1 grey-text">Source:</small>
                        <h6
                          className="cursor-pointer"
                          onClick={() =>
                            setSelected({ ...deal, updatedKey: "source" })
                          }
                        >
                          {source?.displayname || "N/A"}
                        </h6>
                      </div>
                    )}

                    {selected._id === deal._id &&
                    selected.updatedKey === "physician" ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ marginBottom: "-0.5rem", width: "19rem" }}
                      >
                        <Select
                          label={"Physician"}
                          allowObjectValue
                          onChange={(value) =>
                            setSelected({ ...selected, newPhysician: value })
                          }
                          handleCheck={() =>
                            handleUpdate("physicianId._id", "newPhysician")
                          }
                          handleClose={() => setSelected({})}
                          whitelisted
                          soloUpdate
                          className="m-0 p-0 mt-3"
                          // collections={getPhysicians(source._id)}
                          collections={Deals.getPhysicians(
                            source._id,
                            providers
                          )}
                          preValue={deal?.physicianId?._id}
                          formSubmitted={formSubmitted}
                          keys={"value"}
                          values={"text"}
                        />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          if (!deal?.source)
                            return addToast(
                              "Please add a source before adding a physician.",
                              {
                                appearance: "warning",
                              }
                            );
                          setSelected({ ...deal, updatedKey: "physician" });
                        }}
                      >
                        <small className="mr-1 grey-text">Physician:</small>
                        {deal?.physicianId?.fullName?.lname ? (
                          <h6>Dr. {deal?.physicianId?.fullName?.lname}</h6>
                        ) : (
                          <h6 className="cursor-pointer">N/A</h6>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="cursor-pointer">
                    <div className="d-flex align-items-center">
                      <h6
                        className="mt-2"
                        style={{ fontWeight: 600 }}
                        title="Amount"
                      >
                        {currency(deal.amount)}
                      </h6>

                      <img
                        src={img}
                        alt={text}
                        className="ml-1"
                        title={text}
                        style={{
                          ...style,
                        }}
                      />
                    </div>
                    <h6 title="Cash"> {currency(deal.cash)}</h6>
                  </td>

                  <td>
                    <>
                      {didHoverID === index && (
                        <div className="d-flex justify-content-center">
                          <MDBBtnGroup>
                            <MDBBtn
                              size="sm"
                              color="success"
                              title="Add new service"
                              rounded
                              onClick={() => handleCashRegister(deal)}
                            >
                              <MDBIcon icon="plus" />
                            </MDBBtn>
                            <MDBBtn
                              size="sm"
                              color="info"
                              rounded
                              title="Print receipt."
                              onClick={() => handlePrintout(deal)}
                            >
                              <MDBIcon icon="print" />
                            </MDBBtn>
                          </MDBBtnGroup>
                        </div>
                      )}
                      {deal.cart?.map((menu) => (
                        <MDBBadge
                          key={menu.referenceId}
                          className="mx-1 "
                          style={{ opacity: index === didHoverID ? 0 : 1 }}
                        >
                          {menu?.abbreviation}
                        </MDBBadge>
                      ))}
                    </>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No patiend record.
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
    </>
  );
};

export default Tables;
