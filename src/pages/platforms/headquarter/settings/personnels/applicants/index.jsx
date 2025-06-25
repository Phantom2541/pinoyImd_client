import { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../../services/redux/slices/assets/persons/applicants";
import { BROWSE as BROWSE_BRANCHES } from "../../../../../../services/redux/slices/assets/branches";
import { useToasts } from "react-toast-notifications";
import Access from "./modal";
import TableLoading from "../../../../../../components/tableLoading";
import ViewCredential from "./viewCredential";
import { capitalize } from "lodash";
import Body from "./body";

export default function Applicants() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    {
      collections,
      message,
      isSuccess,
      isLoading,
      branches: branchSelections,
    } = useSelector(({ applicants }) => applicants),
    [applicants, setApplicants] = useState([]),
    [activeBranch, setActiveBranch] = useState("all"),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast]);

  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;

  useEffect(() => {
    if (token) {
      dispatch(BROWSE({ token, data: { companyId: companyId?._id } }));
    }
  }, [dispatch, token, companyId?._id]);
  useEffect(() => {
    if (token) {
      dispatch(BROWSE_BRANCHES({ token, key: { companyId: companyId?._id } }));
    }
  }, [dispatch, token, companyId?._id]);

  useEffect(() => {
    const _collections = [...collections].filter(({ status, branch }) => {
      if (activeBranch === "all") {
        return status === "petition";
      } else {
        return status === "petition" && activeBranch === branch?._id;
      }
    });
    setApplicants(_collections);
  }, [collections, activeBranch]);

  return (
    <>
      <MDBCard narrow className="pb-3">
        <MDBView
          cascade
          className="gradient-card-header blue-gradient py-2 mx-4 d-flex justify-content-between align-items-center"
        >
          <span className="ml-3">Applicant List</span>
          <select
            className="form-control"
            style={{ width: "15rem" }}
            onChange={({ target }) => setActiveBranch(target.value)}
          >
            <option value={"all"}> All</option>
            {branchSelections.map(({ _id, name = "", displayname = "" }) => (
              <option key={_id} value={_id}>
                {capitalize(name || displayname)}
              </option>
            ))}
          </select>
        </MDBView>
        <MDBCardBody>
          {!isLoading ? <Body applicants={applicants} /> : <TableLoading />}
        </MDBCardBody>
      </MDBCard>
      <Access />
      <ViewCredential />
    </>
  );
}
