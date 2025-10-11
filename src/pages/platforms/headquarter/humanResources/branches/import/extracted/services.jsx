import { MDBBtn, MDBCollapse, MDBIcon, MDBTable } from "mdbreact";
import { useState } from "react";
import Modal from "../../../../../accounting/catalog/menus/collapse/modal";
import { useDispatch } from "react-redux";
import {
  SetSERVICES,
  SetUNTAGGED_SERVICE,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";
import { Services, Templates } from "../../../../../../../services/fakeDb";
import { capitalize } from "../../../../../../../services/utilities";

const ServiceDatas = ({ isOpen, _id, packages = [] }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const services = Services.whereIn(packages);

  return (
    <tr className="border-left border-right border-bottom border-black ">
      <td colSpan={3}>
        <MDBCollapse
          id={`collapse-${_id}`}
          isOpen={isOpen}
          className="m-0 p-0 mx-3"
        >
          <div className="d-flex justify-content-between">
            <span style={{ fontWeight: 400 }}>Tag Services</span>
            <MDBBtn size="sm" color="info" onClick={() => setShow(!show)}>
              <MDBIcon icon="plus" className="mr-1" /> Add
            </MDBBtn>
          </div>
          <MDBTable>
            <thead>
              <tr>
                <th className="py-1">Description</th>
                <th className="py-1">Department</th>
                <th className="py-1">Template</th>
                <th className="py-1">Preference</th>
                <th className="py-1">Preperation</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service, idx) => {
                  const {
                    name,
                    abbreviation,
                    department,
                    template,
                    preference,
                    preparation,
                  } = service;

                  const matchedTemplate = Templates.collections?.find(
                    (tpl) => tpl.department === department
                  );
                  const templateLabel =
                    matchedTemplate?.components?.[template] || "N/A";

                  return (
                    <tr key={`service-${idx}`}>
                      <td className="py-1">
                        <p className="fw-bold mb-1">{capitalize(name)}</p>
                        <p className="mb-0">{abbreviation?.toUpperCase()}</p>
                      </td>
                      <td className="py-1">{capitalize(department)}</td>
                      <td className="py-1">{templateLabel}</td>
                      <td className="py-1">{preference || "—"}</td>
                      <td className="py-1">{preparation || "—"}</td>
                      <td className="text-center py-1">
                        <MDBBtn
                          size="sm"
                          color="danger"
                          className="m-0 px-2 py-1"
                          onClick={() =>
                            dispatch(
                              SetUNTAGGED_SERVICE({ _id, serviceID: idx })
                            )
                          }
                        >
                          <i className="fas fa-trash-alt" />
                        </MDBBtn>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No Services tagged.
                  </td>
                </tr>
              )}
            </tbody>
          </MDBTable>
        </MDBCollapse>
      </td>
      <Modal
        show={show}
        toggle={() => setShow(!show)}
        handlePick={(services) => {
          dispatch(SetSERVICES({ services, _id }));
          setShow(false);
        }}
      />
    </tr>
  );
};

export default ServiceDatas;
