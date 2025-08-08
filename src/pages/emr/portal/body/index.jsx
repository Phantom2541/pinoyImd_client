import { useMemo, useState } from "react";
import {
  MDBAlert,
  MDBTypography,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabContent,
  MDBTabPane,
  MDBIcon,
  MDBNavLink,
  MDBNav,
  MDBNavItem,
  MDBBtn,
} from "mdbreact";
import { EMR_RESULT_TO_PDF, formColor } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import { useDispatch, useSelector } from "react-redux";
import CountDown from "./countDown";
import Header from "./header";
import { SetACTIVE_TYPE } from "../../../../services/redux/slices/emr/portal";
import "./style.css";
import Loading from "./loading";
import { Services } from "../../../../services/fakeDb";
import Receipt from "./receipt";
const Body = () => {
  const {
      result,
      preferences,
      isResultAvailable = false,
      isResultReady = false,
      hasRender = false,
      activeType = "",
      isLoading = false,
    } = useSelector(({ portal }) => portal),
    dispatch = useDispatch();
  const { diagnostic = {}, department = [] } = result;
  const task = useMemo(() => {
    if (!result?._id || Object.keys(diagnostic).length === 0) return {};
    const _result = diagnostic[activeType];
    const { packages, form } = _result;

    const _packages =
      packages && typeof packages === "object"
        ? Array.isArray(packages)
          ? packages
          : Object.keys(packages).map((k) => Number(k))
        : packages
        ? [packages]
        : [];

    const services =
      department[0] === "LAB"
        ? preferences.filter(({ id }) => _packages.includes(id))
        : Services.find(_packages);

    return {
      ..._result,
      form: form || activeType,
      patient: result.customerId,
      generateHealthyClient: [
        "Urinalysis",
        "Parasitology",
        "Xray",
        "Ultrasound",
      ].includes(activeType),
      services,
    };
  }, [activeType, diagnostic, preferences, result, department]);

  const [activeItem, setActiveItem] = useState(2);

  const toggle = (tab) => {
    if (activeItem !== tab) {
      setActiveItem(tab);
    }
  };
  const tabs = [
    { id: 1, label: "Stub", icon: "receipt" },
    { id: 2, label: "Results", icon: "flask" },
  ];
  const getDepartment = () => {
    switch (department[0]) {
      case "LAB":
        return "laboratory";

      default:
        return "radiology";
    }
  };

  const form = diagnostic[activeType]?.form || activeType;

  const handlePDF = async () => {
    await EMR_RESULT_TO_PDF({
      task,
      form,
      department: getDepartment(),
      result,
    });
  };

  return (
    <div className="mx-2 mt-n3">
      <Header />
      <MDBNav tabs color="indigo" className="nav-justified m-0 py-1">
        {tabs.map((tab) => (
          <MDBNavItem key={tab.id}>
            <MDBNavLink
              link
              to="#!"
              active={activeItem === tab.id}
              onClick={() => toggle(tab.id)}
            >
              <MDBIcon icon={tab.icon} className="mr-3" /> {tab.label}
            </MDBNavLink>
          </MDBNavItem>
        ))}
      </MDBNav>

      {!isLoading ? (
        <MDBTabContent activeItem={activeItem} className="m-0 p-0">
          <MDBTabPane tabId={1} className="m-0 p-0">
            <Receipt />
          </MDBTabPane>
          <MDBTabPane tabId={2} className="m-0 p-0">
            <div className="mt-3">
              {isResultAvailable && (
                <>
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span
                      className="text-nowrap mr-2"
                      style={{ fontWeight: 400 }}
                    >
                      Section Type:
                    </span>
                    <div className="w-100 d-flex align-items-center">
                      <select
                        className="form-control text-primary"
                        style={{ height: "2rem" }}
                        value={activeType}
                        onChange={({ target }) =>
                          dispatch(SetACTIVE_TYPE(target.value))
                        }
                      >
                        {Object.keys(diagnostic)?.map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                      {isResultReady && (
                        <MDBBtn
                          size="sm"
                          color="success"
                          outline
                          rounded
                          className="px-2"
                          onClick={handlePDF}
                          title="Download PDF"
                        >
                          <MDBIcon icon="file-pdf" />
                        </MDBBtn>
                      )}
                    </div>
                  </div>
                  <div className="my-4">
                    <MDBAlert
                      color={formColor(form)}
                      className="text-uppercase text-center py-0 mb-1 p-1"
                    >
                      <h5
                        style={{ letterSpacing: "10px" }}
                        className="mb-0 fw-bold"
                      >
                        {form}
                      </h5>
                    </MDBAlert>
                    {!isResultReady && (
                      <span className="text-primary">
                        Processing of your requested services is still ongoing.
                      </span>
                    )}
                  </div>
                </>
              )}
              <>
                {isResultReady ? (
                  <BodySwitcher task={task} department={department[0]} />
                ) : !hasRender ? (
                  <MDBTypography
                    note
                    noteTitle="Note: "
                    className="mt-5"
                    noteColor="danger"
                  >
                    Please proceed to the {getDepartment()}
                  </MDBTypography>
                ) : (
                  <CountDown />
                )}
              </>
            </div>
          </MDBTabPane>
        </MDBTabContent>
      ) : (
        <div style={{ width: "100%" }}>
          <Loading loadingFor="body" />
        </div>
      )}
    </div>
  );
};

export default Body;
