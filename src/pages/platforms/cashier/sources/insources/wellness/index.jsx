import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBView,
} from "mdbreact";
import Swal from "sweetalert2";

import Pagination from "../../../../../../components/pagination";
import { Search } from "../../../../../../components/searchables";
import TableLoading from "../../../../../../components/tableLoading";
import { HMO } from "../../../../../../services/fakeDb";
import {
  CTBROWSE,
  SetActivePAGE,
  UPDATE,
} from "../../../../../../services/redux/slices/assets/branches";

const Wellness = () => {
  const dispatch = useDispatch();
  const { token, activePlatform, maxPage } = useSelector(({ auth }) => auth);
  const { ct: branch = {}, activePage, isLoading, formSubmitted } = useSelector(
    ({ branches }) => branches,
  );
  const [filtered, setFiltered] = useState([]);

  const isManager = activePlatform?.platform === "manager";
  const hmo = useMemo(() => branch?.hmo || [], [branch?.hmo]);
  const hmoWithDetails = useMemo(
    () =>
      hmo.map((item) => ({
        ...item,
        name: HMO.getName(item.code),
        abbr: HMO.getAbbr(item.code),
      })),
    [hmo],
  );
  const availableHmos = useMemo(() => {
    const selectedCodes = new Set(hmo.map(({ code }) => code).filter(Boolean));

    return HMO.collections
      .slice(1)
      .filter(({ code }) => !selectedCodes.has(code));
  }, [hmo]);
  const totalPages = Math.ceil(filtered.length / maxPage) || 1;
  const startIndex = (activePage - 1) * maxPage;
  const paginated = filtered.slice(startIndex, startIndex + maxPage);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        CTBROWSE({
          token,
          data: { _id: activePlatform.branchId },
        }),
      );
    }
  }, [activePlatform?.branchId, dispatch, token]);

  useEffect(() => {
    if (activePage > totalPages) dispatch(SetActivePAGE(totalPages));
  }, [activePage, dispatch, totalPages]);

  useEffect(() => {
    setFiltered(hmoWithDetails);
  }, [hmoWithDetails]);

  const updateHmo = (nextHmo) =>
    dispatch(
      UPDATE({
        token,
        data: {
          _id: activePlatform.branchId,
          hmo: nextHmo,
        },
      }),
    );

  const openOrganizationForm = (item = {}) => {
    const { code, contacts = {} } = item;

    Swal.fire({
      title: `Edit ${HMO.getName(code)}`,
      html: `
        <input id="hmo-person" class="swal2-input" placeholder="Contact person">
        <input id="hmo-mobile" class="swal2-input" placeholder="Mobile">
        <input id="hmo-email" class="swal2-input" placeholder="Email">
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      didOpen: () => {
        document.getElementById("hmo-person").value = contacts.person || "";
        document.getElementById("hmo-mobile").value = contacts.mobile || "";
        document.getElementById("hmo-email").value = contacts.email || "";
      },
      preConfirm: () => {
        return {
          ...item,
          contacts: {
            person: document.getElementById("hmo-person")?.value.trim(),
            mobile: document.getElementById("hmo-mobile")?.value.trim(),
            email: document.getElementById("hmo-email")?.value.trim(),
          },
        };
      },
    }).then(({ isConfirmed, value }) => {
      if (!isConfirmed) return;
      updateHmo(
        hmo.map((entry) => (entry._id === item._id ? value : entry)),
      );
    });
  };

  const handleAdd = () => {
    if (!availableHmos.length) {
      Swal.fire("Complete", "All available HMOs are already selected.", "info");
      return;
    }

    const inputOptions = availableHmos.reduce(
      (options, { code, name, abbr }) => ({
        ...options,
        [code]: `${name}${abbr ? ` (${abbr})` : ""}`,
      }),
      {},
    );

    Swal.fire({
      title: "Select Accredited HMO",
      input: "select",
      inputOptions,
      inputPlaceholder: "Select HMO",
      showCancelButton: true,
      confirmButtonText: "Add",
      inputValidator: (code) => (!code ? "Please select an HMO." : undefined),
    }).then(({ isConfirmed, value: code }) => {
      if (!isConfirmed) return;
      updateHmo([...hmo, { code }]);
    });
  };

  const handleRemove = (item) => {
    Swal.fire({
      title: "Remove Accredited Health Organization?",
      text: HMO.getName(item.code),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Remove",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        updateHmo(hmo.filter(({ _id }) => _id !== item._id));
      }
    });
  };

  const handlePageChange = (action) => {
    const page = activePage + (action ? 1 : -1);
    if (page >= 1 && page <= totalPages) dispatch(SetActivePAGE(page));
  };

  return (
    <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
      >
        <span className="white-text mx-3 text-nowrap">
          {hmo.length} Accredited Health Management Organization
          {hmo.length === 1 ? "" : "s"}
        </span>
        <Search
          collections={hmoWithDetails}
          setFiltered={(items) => {
            setFiltered(items);
            dispatch(SetActivePAGE(1));
          }}
          reset={() => setFiltered(hmoWithDetails)}
          haveAction={isManager}
          hideButton={isManager}
          handleAdd={handleAdd}
        />
      </MDBView>

      <MDBCardBody>
        {isLoading ? (
          <TableLoading />
        ) : (
          <MDBTable striped bordered responsive>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Organization</th>
                <th>Contact Person</th>
                <th>Mobile</th>
                <th>Email</th>
                {isManager && <th>Actions</th>}
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {!paginated.length && (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="text-center">
                    No accredited health organizations found.
                  </td>
                </tr>
              )}
              {paginated.map((item, index) => (
                <tr key={item._id || `${item.code}-${index}`}>
                  <td>{startIndex + index + 1}</td>
                  <td>{HMO.getName(item.code)}</td>
                  <td>{item.contacts?.person}</td>
                  <td>{item.contacts?.mobile}</td>
                  <td>{item.contacts?.email}</td>
                  {isManager && (
                    <td>
                      <MDBBtnGroup>
                        <MDBBtn
                          size="sm"
                          color="info"
                          disabled={formSubmitted}
                          onClick={() => openOrganizationForm(item)}
                        >
                          <MDBIcon icon="edit" className="mr-1" />
                          Edit
                        </MDBBtn>
                        <MDBBtn
                          size="sm"
                          color="danger"
                          disabled={formSubmitted}
                          onClick={() => handleRemove(item)}
                        >
                          <MDBIcon icon="trash" className="mr-1" />
                          Remove
                        </MDBBtn>
                      </MDBBtnGroup>
                    </td>
                  )}
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBCardBody>

      <div className="mt-auto d-flex justify-content-end px-4">
        <Pagination
          isLoading={isLoading}
          total={totalPages}
          page={activePage}
          setPage={handlePageChange}
        />
      </div>
    </MDBCard>
  );
};

export default Wellness;
