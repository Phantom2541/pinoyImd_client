import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";

import {
  SetCLONE,
  TOGGLE_CLONE_WARNING,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";
import utils from "../utils";
import { capitalize, currency } from "../../../../../../../services/utilities";
export default function CloneWarning() {
  const {
      showCloneWarning: show,
      overwriteItems,
      clone,
    } = useSelector(({ menus }) => menus),
    { collections: branches } = useSelector(({ branches }) => branches),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_CLONE_WARNING());
  const { from, to, type } = clone;

  const collectionsWithoutOverwrite = () =>
    [...from.collections].filter(
      (item) =>
        !overwriteItems.some((m) => utils.getName(m) === utils.getName(item)) &&
        Object.keys(item).length &&
        !item.deleted &&
        !item.overwrite &&
        !to.collections.some(({ _id }) => _id === item._id)
    );

  const handleSubmit = (isOverwrite = false) => {
    const fromCollections = [...from.collections];
    const existingCollections = [...to.collections];
    const deletedTo = [...(to.deleted || [])];

    const arrangeDatas = (collections, isNew = true) => {
      collections
        .filter((m) => Object.keys(m).length)
        .forEach((item) => {
          const index = fromCollections.findIndex(
            (m) => utils.getName(m) === utils.getName(item)
          );
          const baseItem = isNew ? item : { ...fromCollections[index] };
          const { _id, ...rest } = baseItem;
          if (index > -1) {
            //kapag menus to be clouned
            if (isNew) {
              //check muna kung existing ba siya sa deleted
              const deletedIndex = deletedTo.findIndex(
                (d) => utils.getName(d) === utils.getName(item)
              );
              const isExistInDeleted = deletedIndex > -1;

              //kapag existing sa deleted magiging overwrite siya kapag hinid naman magiging new siya
              existingCollections[index] = {
                ...rest,
                overwrite: isExistInDeleted ? true : false,
                deleted: false,
                new: isExistInDeleted ? false : true,
                ...(isExistInDeleted && { _id: deletedTo[deletedIndex]?._id }),
              };

              //kapag existing sa deleted tatanggalin siya sa deleted
              if (deletedIndex > -1) {
                deletedTo.splice(deletedIndex, 1);
              }
            } else {
              //override
              existingCollections[index] = {
                ...rest,
                overwrite: true,
                deleted: false,
                new: false,
                _id: existingCollections[index]?._id,
              };
            }
          }
        });
    };

    arrangeDatas(collectionsWithoutOverwrite(), true);

    if (isOverwrite) {
      arrangeDatas(overwriteItems, false);
    }
    dispatch(
      SetCLONE({
        ...clone,
        to: { ...to, collections: existingCollections, deleted: deletedTo },
      })
    );
    toggle();
  };

  return (
    <MDBModal
      size="lg"
      isOpen={show}
      toggle={toggle}
      backdrop
      className="mt-5"
      tabIndex="3"
    >
      <MDBModalHeader toggle={toggle} className="red darken-3 white-text">
        <MDBIcon icon="clone" className="mr-2" />
        Clone Confirmation
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <p
          style={{
            marginBottom: "12px",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          The following {type} already exist in{" "}
          <strong style={{ color: "#007bff" }}>
            {utils.getBranchName(to?._id, branches)}
          </strong>{" "}
          and will be <b style={{ color: "#d9534f" }}>overwritten</b> by {type}
          from{" "}
          <strong style={{ color: "#007bff" }}>
            {utils.getBranchName(from?._id, branches)}
          </strong>
          .
        </p>
        <MDBRow>
          {[
            {
              title: `${capitalize(type)} to be overwritten`,
              collections: overwriteItems,
            },
            {
              title: `${capitalize(type)} to be cloned`,
              collections: collectionsWithoutOverwrite(),
            },
          ]
            .filter(({ collections }) => collections.length)
            .map(({ title, collections = [] }) => (
              <MDBCol key={title}>
                <p>
                  {title}
                  <strong className="ml-1">({collections.length})</strong>
                </p>

                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <ul
                    style={{
                      listStyleType: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {collections.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          padding: "6px 0",
                          borderBottom:
                            index !== overwriteItems.length - 1
                              ? "1px solid #ddd"
                              : "none",
                          color: "#343a40",
                          fontSize: "14px",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            •
                            <span style={{ fontWeight: 400 }} className="ml-1">
                              {capitalize(utils.getName(item))}
                            </span>{" "}
                          </div>
                          <span style={{ fontWeight: 400 }}>
                            {currency.format(item.opd)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </MDBCol>
            ))}
        </MDBRow>

        <p
          style={{
            marginTop: "14px",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          Would you like to <b>overwrite</b> these existing {type} or{" "}
          <b>skip</b> them and only clone new ones?
        </p>
        <div className="d-flex justify-content-center">
          <MDBBtn color="info" onClick={() => handleSubmit(true)}>
            Overwrite
          </MDBBtn>
          <MDBBtn color="primary" onClick={() => handleSubmit(false)}>
            Skip Duplicates
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
