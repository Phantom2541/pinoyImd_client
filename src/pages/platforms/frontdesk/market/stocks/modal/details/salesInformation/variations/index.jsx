import { MDBBtn, MDBIcon } from "mdbreact";
import Variant from "./variant";
import Pricing from "./pricing";
import Information from "./information";

const Variations = ({
  variants,
  isDuplicate = false,
  setVariants = () => {},
  setIsDuplicate = () => {},
}) => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <div className="w-50  ">
          {variants.types?.map((variant, index) => (
            <Variant
              index={index}
              variant={variant}
              setVariants={setVariants}
              variants={variants}
              setIsDuplicate={setIsDuplicate}
            />
          ))}
          {variants.types?.length < 2 && (
            <MDBBtn
              size="md"
              color="info"
              block
              className="mb-3 mt-n1"
              outline
              onClick={() =>
                setVariants((prevVariants) => ({
                  ...prevVariants,
                  types: [...prevVariants.types, { title: "", options: [""] }],
                }))
              }
            >
              <MDBIcon icon="plus" className="mr-1" /> Add Variant
            </MDBBtn>
          )}
        </div>
      </div>
      <Information variants={variants} setVariants={setVariants} />
      <Pricing
        variants={variants}
        setVariants={setVariants}
        isDuplicate={isDuplicate}
      />
    </>
  );
};

export default Variations;
