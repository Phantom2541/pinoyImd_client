import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBStepper,
  MDBStep,
  MDBBtn,
} from "mdbreact";
import { TOGGLE } from "../../../../../../services/redux/slices/commerce/catalog/products";
import Search from "./search";
import { useState } from "react";
import Details from "./details";
export default function Modal() {
  const { showModal: show } = useSelector(({ products }) => products),
    [isDetails, setIsDetails] = useState(false),
    [product, setProduct] = useState({}),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE());

  const handleNext = (_product) => {
    setProduct(_product);
    setIsDetails(true);
  };

  return (
    <MDBModal
      size={isDetails ? "xl" : "lg"}
      isOpen={show}
      toggle={toggle}
      backdrop
      className="transition transition-all"
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="book-open" className="mr-2" />
        Add Product
      </MDBModalHeader>
      <MDBModalBody className="mb-0 ">
        <div style={{ marginTop: "-33px" }}>
          <MDBStepper className="m-0 p-0 ">
            <MDBStep className={"active"}>
              <a>
                <span className="circle">1</span>
                <span className="label">Choose Product</span>
              </a>
            </MDBStep>
            <MDBStep className={isDetails ? "active" : ""}>
              <a>
                <span className="circle">2</span>
                <span className="label">Product Details</span>
              </a>
            </MDBStep>
          </MDBStepper>
        </div>
        {!isDetails ? (
          <Search handleNext={handleNext} />
        ) : (
          <Details product={product} />
        )}

        <div className="d-flex justify-content-between">
          {isDetails && (
            <MDBBtn
              size="md"
              color="secondary"
              onClick={() => setIsDetails(false)}
            >
              Back
            </MDBBtn>
          )}
          <MDBBtn size="md" color="primary">
            Save
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
