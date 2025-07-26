import { useSelector } from "react-redux";
import { MDBTypography, MDBRow, MDBCardBody } from "mdbreact";
import Card from "./card";

const Body = () => {
  const { filtered, isLoading, maxPage, activePage } = useSelector(
    ({ taskGenerator }) => taskGenerator
  );

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);
  return (
    <MDBCardBody>
      {!paginatedData?.length && !isLoading && (
        <MDBTypography noteColor="info" note>
          Tasks are empty
        </MDBTypography>
      )}
      <MDBRow>
        {paginatedData?.map((sale, index) => (
          <Card item={sale} index={filtered.length - 1 - index} key={index} />
        ))}
      </MDBRow>
    </MDBCardBody>
  );
};

export default Body;
