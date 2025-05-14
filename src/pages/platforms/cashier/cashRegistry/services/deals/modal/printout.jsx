import { useSelector, useDispatch } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import { ClaimStub } from "../../../../../../../components/printout";
import { SetPrinting } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";

export default function Modal() {
  const { onPrint } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();
  const handleClose = () => dispatch(SetPrinting({ status: false }));

  const printDiv = () => {
    const content = document.getElementById("printableArea").innerHTML;
    const styles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .printable-content {
          width: 100%;
          margin: 0 auto;
        }
      </style>
    `;

    const myWindow = window.open("", "", "height=600,width=800");
    myWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          ${styles}
        </head>
        <body>
          <div class="printable-content">
            ${content}
          </div>
        </body>
      </html>
    `);
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();
  };

  return (
    <MDBModal isOpen={onPrint} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBBtn onClick={printDiv}>
          <MDBIcon icon="print" className="mr-2" /> Print
        </MDBBtn>
        Clain Stub
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <ClaimStub />
      </MDBModalBody>
    </MDBModal>
  );
}
