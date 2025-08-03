import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import {
  SetEDIT,
  DESTROY,
} from "../../../../../../../../services/redux/slices/market/machines";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import Services from "./services";
import { BROWSE } from "../../../../../../../../services/indexDB/commerce/market/machines";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ machines }) => machines
    ),
    [machines, setMachines] = useState([]),
    dispatch = useDispatch();
  const [activeId, setActiveId] = useState("");

  const { token } = useSelector(({ auth }) => auth);

  useEffect(() => {
    async function fetchAllServices() {
      const results = await Promise.all(
        [...filtered].map(async (item) => {
          const services = await BROWSE(item._id);
          return {
            ...item,
            services,
          };
        })
      );
      setMachines(results);
    }

    fetchAllServices();
  }, [filtered]);

  const handleDelete = (item) => {
    Swal.fire({
      title: `Delete "${item.model} ${item.brand}"?`,
      text: "This process cannot be reverted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ data: { _id: item._id }, token }));
      }
    });
  };

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = machines.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Serial No.</th>
          <th>Accuqired</th>
          <th className="text-center">LIS Capable</th>
          <th>Status</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const {
            _id,
            model,
            brand,
            serial,
            accuqired,
            status,
            price,
            lisCapable = false,
            section = "",
            services = [],
          } = item;

          const isOpen = activeId === index;

          return (
            <React.Fragment key={_id}>
              <tr>
                <td>{index + startIndex + 1}</td>
                <td>
                  <b>
                    <h6>{model}</h6>
                    <small className="mt-n1 d-block">{brand}</small>
                  </b>
                </td>
                <td>
                  <b>{serial}</b>
                </td>
                <td>
                  <b>{accuqired}</b>
                </td>
                <td className="text-center">
                  {lisCapable ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <MDBIcon icon="check" className="mr-2 text-success" />
                        {section}
                      </div>
                      <div className="d-flex align-items-center">
                        <MDBBtn
                          size="sm"
                          color="white"
                          title="View Services"
                          rounded
                          onClick={() =>
                            setActiveId((prev) => (prev === index ? -1 : index))
                          }
                          className="m-0 p-0 transition-all "
                          style={{
                            height: "1.3rem",
                            width: activeId === index ? "1.5rem" : "2rem",
                          }}
                        >
                          <i
                            style={{
                              rotate: `${activeId === index ? 0 : 90}deg`,
                            }}
                            className="fa fa-angle-down transition-all "
                          />
                        </MDBBtn>
                        {!isOpen && services.length > 0 && (
                          <span
                            className="counter"
                            style={{
                              marginBottom: "-15px",
                            }}
                          >
                            {services.length}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <MDBIcon icon="times" className="text-danger" />
                  )}
                </td>
                <td>
                  <b>{status}</b>
                </td>
                <td>
                  <b>{price}</b>
                </td>

                <td>
                  <MDBBtn
                    size="sm"
                    color="blue"
                    onClick={() => dispatch(SetEDIT(item))}
                  >
                    Update
                  </MDBBtn>

                  <MDBBtn
                    size="sm"
                    color="danger"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </MDBBtn>
                </td>
              </tr>
              {isOpen && (
                <Services
                  isOpen={isOpen}
                  _key={`${index}-${_id}-${isOpen}`}
                  machine={item}
                />
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
