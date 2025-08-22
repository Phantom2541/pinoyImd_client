import { MDBCard } from "mdbreact";
import Header from "./header";
import Body from "./body";
import TableLoading from "../../../../components/tableLoading";
import { useSelector } from "react-redux";

const PasswordReseter = () => {
  const { isLoading } = useSelector(({ users }) => users);
  return (
    <MDBCard narrow>
      <Header />
      {isLoading ? <TableLoading /> : <Body />}
    </MDBCard>
  );
};

export default PasswordReseter;
