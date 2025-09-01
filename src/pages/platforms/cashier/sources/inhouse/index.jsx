import { MDBCard } from "mdbreact";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import { useSelector } from "react-redux";
import TableLoading from "../../../../../components/tableLoading";
const Inhouse = () => {
  const { isLoading = false } = useSelector(({ branches }) => branches);

  return (
    <MDBCard narrow>
      <Header />
      {isLoading ? (
        <TableLoading className="mt-3" />
      ) : (
        <>
          <Body />
          <Footer />
        </>
      )}
    </MDBCard>
  );
};

export default Inhouse;
