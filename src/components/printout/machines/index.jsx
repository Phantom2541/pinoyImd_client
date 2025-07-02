import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Banner } from "../../../services/utilities";
import { BROWSE, SetFILTER } from "../../../services/redux/slices/market/machines";
import { MDBTable } from "mdbreact";

const Machines = () => {


    const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

    const { collections } = useSelector(({ machines }) => machines);

    useEffect(() => {
        dispatch(BROWSE({ token, params: { branchId: activePlatform.branchId } }));
    }, [dispatch, token, activePlatform]);


    useEffect(() => {
      const result = collections.filter(
        (item) =>
          item?.status?.toLowerCase() === "fully functional" ||
          item?.status?.toLowerCase() === "functional"
      );
  
      dispatch(SetFILTER(result));
    }, [collections, dispatch]);   
  
  
  const { filtered, activePage, maxPage, isSuccess } = useSelector(({ machines }) => machines);
  

    
    const itemsPerPage = maxPage;
    const startIndex = (activePage - 1) * itemsPerPage;

    const company = activePlatform?.branch?.companyId?.name || "";
    const name = activePlatform?.branch?.name || "";
    console.log("SHOWING activePlatform: ", activePlatform);
    console.log("SHOWING NAME: ", name);
    console.log("SHOWING COMPANY: ", company);

    
    
    return (
      <>
          <Banner
            company={company}
            branch={name}
          />
          <MDBTable responsive hover bordered>
          <thead style={{ backgroundColor: "#", color: "black" }}>
            <tr>
              <th>#</th>
              <th>Model</th>
              <th>Brand</th>
              <th>Serial</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((item, index) => {
              const { _id, model, brand, serial, status } = item;
    
              return (
                <tr key={index}>
                  <td key={index}>{index + startIndex + 1}</td>
                  <td>{model}</td>
                  <td>{brand}</td>
                  <td>{serial}</td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
            </MDBTable>
      




        </>
        


  );
};

export default Machines;
