import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBIcon, MDBBadge } from "mdbreact";
import {
  capitalize,
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
import PickPhysician from "../../../../../../../components/searchables/physicians/pickPhysician";
import PaymentDetails from "./paymentDetails";
import "./style.css";
const Tables = () => {
  const { token, maxPage, activePlatform } = useSelector(({ auth }) => auth),
    {
      collections,
      filtered,
      formSubmitted,
      isSuccess,
      activePage,
      total,
      dealsLoading: isLoading,
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
    setData(filtered);
  }, [filtered]);

  useEffect(() => {
    if (providers.length > 0) {
      let _providerOptions = providers.map(({ clients }) => ({
        _id: clients?._id,
        text: `${clients?.displayname?.toUpperCase()}`,
      }));

      _providerOptions.unshift({ _id: "", text: "No Source" });

      setProviderOptions(_providerOptions);
    }
  }, [providers]);

  //Set fetched data for mapping
  useEffect(() => {
    const _deals =
      view === "all"
        ? collections
        : collections?.filter(({ perform }) => perform === view);
    dispatch(SetTOTAL(_deals.reduce((a, c) => a + c.amount, 0)));
    dispatch(SetFILTERED(_deals));
  }, [collections, view, dispatch, isLoading]);

  // Sample generateStub function

  const handlePrintout = (selected) => {
    localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
    setTimeout(() => {
      window.open(
        "/printout/claimstub",
        "Claim Stub",
        "top=100px,left=150px,width=450px,height=850px"
      );
    }, 50);
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
      email: customerId?.email,
      verified: customerId?.verified || false,
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

  const showingPhysician = (deal) => {
    const { physicianId = {}, physicianSTR = "" } = deal;
    const physician = () => {
      if (!physicianId?._id) return capitalize(physicianSTR);
      return physicianId?.fullName?.lname;
    };

    return physicianId ? (
      <h6>Dr. {physician()}</h6>
    ) : (
      <h6 className="cursor-pointer">N/A</h6>
    );
  };

  const getPhysicians = (fk) => {
    return (
      [...providers].find(({ clients }) => clients._id === fk)?.clients
        ?.affiliated || []
    );
  };
  const getSourceForPhysician = (sourceId) => {
    const source = [...providers].find(
      ({ clients }) => clients._id === sourceId
    );

    if (!source?._id) return {};
    return { _id: source?._id, branch: source?.clients?._id };
  };

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <>
      {collections.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginTop: "-1.4rem",
          }}
        >
          <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
            {currency.format(total)}
          </p>
          <div style={{ flex: 1, borderBottom: "1px dashed black" }}></div>
          <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
            @ {collections.length} Patient/s
          </p>
        </div>
      )}

      <MDBTable hover small>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>SSX</th>
            <th>Physician/Source</th>
            <th>Services</th>
            <th className="text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData?.map((deal, index) => {
              const isMatch = (key) =>
                selected?._id === deal?._id && selected.updatedKey === key;
              const { source = {} } = deal || [];
              const isSourceEdit = isMatch("source");
              const isPhysicianEdit = isMatch("physician");
              const isSSXEdit = isMatch("ssx");

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
                        title={
                          deal.category === "walkin"
                            ? deal.category
                            : Categories?.find(
                                ({ abbr = "" }) => abbr === deal?.category
                              )?.name
                        }
                      >
                        {deal.category === "walkin"
                          ? deal.category
                          : Categories.find(
                              ({ abbr = "" }) => abbr === deal?.category
                            )?.abbr?.toUpperCase()}
                      </MDBBadge>
                    )}
                    @ {new Date(deal?.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="position-relative">
                    <div
                      style={{
                        width: "17rem",
                        opacity: isSSXEdit ? 1 : 0,
                        zIndex: isSSXEdit ? 9999 : -1,
                      }}
                      className={`mt-3 d-flex p-1 align-items-center position-absolute ${
                        isSSXEdit && "deals-zoom-in"
                      }`}
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
                        className=" w-100  deals-zoom-in-input-ssx"
                      />
                    </div>
                    <span
                      className="cursor-pointer"
                      style={{ fontWeight: 400, opacity: isSSXEdit ? 0 : 1 }}
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
                  </td>
                  <td className="position-relative ">
                    <div
                      style={{
                        width: "17rem",
                        marginBottom: "-0.7rem",
                        opacity: isSourceEdit ? 1 : 0,
                        zIndex: isSourceEdit ? 9999 : -1,
                      }}
                      className={` d-flex align-items-center position-absolute ${
                        isSourceEdit && "deals-zoom-in"
                      }`}
                    >
                      <Select
                        onChange={(value) =>
                          setSelected({ ...selected, newSource: value })
                        }
                        handleCheck={() =>
                          handleUpdate("source._id", "newSource", deal)
                        }
                        handleClose={() => setSelected({})}
                        whitelisted
                        soloUpdate
                        className="m-0 p-0 mb-n2 "
                        collections={providerOptions}
                        preValue={source?._id}
                        formSubmitted={formSubmitted}
                        keys={"_id"}
                        values={"text"}
                      />
                    </div>
                    <div
                      onClick={() =>
                        setSelected({ ...deal, updatedKey: "source" })
                      }
                      style={{
                        opacity: isSourceEdit ? 0 : 1,
                      }}
                    >
                      <small className="mr-1 grey-text">Source:</small>
                      <h6 className="cursor-pointer">
                        {source?.displayname || "N/A"}
                      </h6>
                    </div>
                    <div
                      style={{
                        width: "19rem",
                        opacity: isPhysicianEdit ? 1 : 0,
                        zIndex: isPhysicianEdit ? 2 : -1,
                      }}
                      className={`position-absolute mt-3 py-1 ${
                        isPhysicianEdit && "deals-zoom-in"
                      }`}
                    >
                      {isPhysicianEdit && (
                        <PickPhysician
                          defaultValue={
                            !deal?.physicianId?._id
                              ? deal?.physicianSTR
                              : fullName(deal?.physicianId?.fullName)
                          }
                          classNameInput="deals-zoom-in-input-physician "
                          formSubmitted={formSubmitted}
                          isEditable
                          suggested={getPhysicians(deal.source._id)}
                          source={getSourceForPhysician(deal?.source?._id)}
                          onChange={(value) =>
                            setSelected({
                              ...selected,
                              newPhysician: {
                                ...value,
                                branch: activePlatform.branchId,
                                source: getSourceForPhysician(
                                  deal?.source?._id
                                ),
                              },
                            })
                          }
                          handleCheck={() =>
                            handleUpdate("physicianId._id", "newPhysician")
                          }
                          handleClose={() => setSelected({})}
                        />
                      )}
                    </div>
                    <div
                      className="cursor-pointer"
                      style={{
                        opacity: isPhysicianEdit ? 0 : 1,
                      }}
                      onClick={() => {
                        setSelected({ ...deal, updatedKey: "physician" });
                      }}
                    >
                      <small className="mr-1 grey-text">Physician:</small>
                      {showingPhysician(deal)}
                    </div>
                  </td>
                  <td className="cursor-pointer">
                    {deal.cart?.map((menu) => (
                      <MDBBadge
                        key={menu.referenceId}
                        className="mx-1 "
                        title={menu.description}
                      >
                        {menu?.abbreviation}
                      </MDBBadge>
                    ))}
                  </td>

                  <td>
                    <>
                      {didHoverID === index && (
                        <div className="d-flex align-items-center justify-content-center mb-n2">
                          <button
                            onClick={() => handleCashRegister(deal)}
                            title="Add new service"
                            className="mr-1"
                            style={{
                              background: "#28a745",
                              border: "none",

                              color: "white",
                              borderRadius: "4px",
                              boxShadow: "0 0px 7px  rgba(0, 0, 0, 0.2)",
                              padding: "5px 8px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <MDBIcon icon="plus" />
                          </button>

                          <button
                            onClick={() => handlePrintout(deal)}
                            title="Print receipt."
                            style={{
                              background: "#007bff",
                              border: "none",
                              color: "white",
                              borderRadius: "4px",
                              boxShadow: "0 0px 7px  rgba(0, 0, 0, 0.2)",
                              padding: "5px 8px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <MDBIcon icon="print" />
                          </button>
                        </div>
                      )}
                      <div
                        style={{
                          opacity: index === didHoverID ? 0 : 1,
                          height: index === didHoverID ? "1rem" : "auto",
                        }}
                      >
                        <PaymentDetails deal={deal} />
                      </div>
                      {/* <div
                        className="d-flex align-items-center flex-column"
                        style={{ opacity: index === didHoverID ? 0 : 1 }}
                      >
                        <div className="d-flex align-items-center">
                          <h6
                            className="mt-2"
                            style={{ fontWeight: 600 }}
                            title="Amount"
                          >
                            {currency.format(deal.amount)}
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
                        <h6
                          title="Cash"
                          style={{
                            opacity: index === didHoverID ? 0 : 1,
                            fontSize: "0.7rem",
                          }}
                        >
                          {currency.format(deal.cash)}
                        </h6>
                      </div> */}
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
