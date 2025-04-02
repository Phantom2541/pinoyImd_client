import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardHeader,
  MDBRow,
} from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import {
  SetINHOUSE,
  SetOUTSOURCE,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { useToasts } from "react-toast-notifications";

const Body = ({ setOutSource, outSource }) => {
  const dispatch = useDispatch();
  const { inhouse, outsource } = useSelector(
      ({ taskGenerator }) => taskGenerator
    ),
    { collections } = useSelector(({ providers }) => providers),
    [outSources, setOutSources] = useState([]),
    { addToast } = useToasts();

  useEffect(() => {
    const _outSources = collections.map(({ vendors }) => ({
      text: vendors?.displayname || vendors?.name || "a",
      value: vendors?._id || "a",
    }));

    setOutSources(_outSources);
  }, [collections]);

  const handleDragStart = (e, item, fromList) => {
    if (!outSource) return console.log("Select outsource!!!");
    const dragPreview = document.createElement("div");
    dragPreview.textContent = item.name;
    Object.assign(dragPreview.style, {
      position: "absolute",
      top: "0",
      left: "0",
      padding: "8px 12px",
      width: "15rem",
      background: "white",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxShadow: "0 2px 50px rgba(172, 161, 161, 0.2)",
      fontSize: "1rem",
      fontWeight: "500",
      color: "#333",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
    });

    document.body.appendChild(dragPreview);

    // Set as drag image
    e.dataTransfer.setDragImage(
      dragPreview,
      dragPreview.clientWidth / 2,
      dragPreview.clientHeight / 2
    );
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ item, fromList })
    );
  };

  const handleDrop = (e, toList) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const { item, fromList } = JSON.parse(data);

    if (fromList === toList) return;
    if (toList === "outsource") {
      dispatch(SetOUTSOURCE(item));
    } else {
      dispatch(SetINHOUSE(item));
    }

    // Dispatch actions to update Redux state
    dispatch({ type: "REMOVE_FROM_LIST", payload: { item, fromList } });
    dispatch({ type: "ADD_TO_LIST", payload: { item, toList } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const List = ({ collections, title }) => {
    return (
      <MDBCol
        onDrop={(e) => handleDrop(e, title.toLowerCase())}
        onDragOver={handleDragOver}
      >
        <MDBCard className="dragDrop">
          <MDBCardHeader className="bg-light dragDrop d-flex justify-content-between align-items-center">
            <span style={{ fontWeight: 500 }}>{title}</span>
            {title === "Outsource" && (
              <select
                value={outSource}
                onChange={({ target }) => setOutSource(target.value)}
                className="form-control form-control-sm ml-2 m-0 p-0  text-primary"
                style={{ marginBottom: "-5rem !important" }}
              >
                <option value={""} disabled={outSource ? true : false}>
                  Select outsource
                </option>
                {outSources.map(({ text, value }, index) => (
                  <option key={index} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            )}
          </MDBCardHeader>
          <MDBCardBody className="m-0 p-0 dragDrop">
            <MDBListGroup
              style={{ maxHeight: "25rem", overflowY: "auto" }}
              className="summary-scrollbar"
            >
              {collections.length > 0 ? (
                collections.map((item, index) => (
                  <MDBListGroupItem
                    key={index}
                    className="cursor-pointer"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, item, title.toLowerCase())
                    }
                  >
                    {item.name}
                  </MDBListGroupItem>
                ))
              ) : (
                <MDBListGroupItem
                  className={!outSource ? "text-start" : "text-center"}
                >
                  {!outSource && title === "Outsource" ? (
                    <p>
                      You need to select a{" "}
                      <span className="text-primary">outsource</span> to
                      activate the drag and drop
                    </p>
                  ) : (
                    "No Record"
                  )}
                </MDBListGroupItem>
              )}
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  };

  return (
    <div>
      <MDBRow>
        <List collections={inhouse} title="Inhouse" />
        <List collections={outsource} title="Outsource" />
      </MDBRow>
    </div>
  );
};

export default Body;
