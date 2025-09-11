import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdbreact";
import { EditableUser } from "../../../../../../../../components/customizable";
import { useDispatch, useSelector } from "react-redux";
import { HMO } from "../../../../../../../../services/fakeDb";
import Menus from "./menus";
import Register from "./register";
import { useEffect, useState } from "react";
import { WALKIN } from "../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import Spinner from "../../../../../../../../components/spinner";
import { generateEmail } from "../../../../../../../../services/utilities";
import Swal from "sweetalert2";

export default function Walkin({ show, toggle }) {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { formSubmitted } = useSelector(({ onBoardings }) => onBoardings);
  const { company } = useSelector(({ auth }) => auth);
  const { hmo: companyHMO } = company;
  const [isRegister, setIsRegister] = useState(false);
  const [register, setRegister] = useState({});
  const [form, setForm] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setForm({});
      setRegister({});
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRegister && !form?.pid)
      return Swal.fire({
        icon: "warning",
        title: "Patient Required",
        text: "Please select a patient first via search before proceeding.",
        confirmButtonText: "OK",
      });

    const { cart, ...rest } = form;
    const services = cart.flatMap(({ packages }) => packages);
    const _form = {
      ...rest,
      services,
      vendor: activePlatform?.branchId,
      isWalkin: true,
      schedule: new Date().toLocaleDateString(),
      haveCard: true,
      register: {
        ...register,
        ...(isRegister && {
          password: register?.dob.replaceAll("-", ""),
          email: register.email || generateEmail(register),
        }),
      },
      isRegister,
    };
    dispatch(WALKIN({ data: _form, token })).then(() => toggle());
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text py-2"
      >
        <MDBIcon icon="walking" className="mr-2" />
        Walkin
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol>
              <div>
                {isRegister ? (
                  <Register
                    setIsRegister={setIsRegister}
                    form={register}
                    setForm={setRegister}
                  />
                ) : (
                  <>
                    <span style={{ fontWeight: 400 }}>Patient:</span>
                    <EditableUser
                      readOnly={true}
                      hasRegister
                      setUserId={(value) => setForm({ ...form, pid: value })}
                      setRegister={(value) => {
                        setIsRegister(true);
                        setRegister({ fullName: value });
                      }}
                    />
                  </>
                )}
              </div>
              <div className="mt-3">
                <span style={{ fontWeight: 400 }}>HMO Card:</span>
                <select
                  required
                  className="form-control"
                  value={form?.requirements?.hmo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requirements: {
                        ...form.requirements,
                        hmo: e.target.value,
                      },
                    })
                  }
                >
                  <option value={""}>Choose an HMO</option>
                  {companyHMO.map((hmo, index) => (
                    <option value={hmo.code} key={index}>
                      {HMO.getName(hmo.code)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <span style={{ fontWeight: 400 }}>Card No.:</span>
                <input
                  required
                  className="form-control"
                  placeholder="Type here.."
                  value={form?.requirements?.cardId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requirements: {
                        ...form.requirements,
                        cardId: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </MDBCol>

            <Menus setForm={setForm} />
          </MDBRow>
          <MDBBtn
            className="float-right"
            color="primary"
            type="submit"
            disabled={formSubmitted || form?.cart?.length === 0}
          >
            Submit <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
