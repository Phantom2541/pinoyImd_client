import { useCallback, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBBtn,
} from "mdbreact";
import { TOGGLE_CLONE } from "../../../../../../services/redux/slices/assets/branches";
import { useDispatch, useSelector } from "react-redux";
import Bucket from "./bucket";
import {
  CLONE,
  SetCLONE,
} from "../../../../../../services/redux/slices/commerce/catalog/menus";
import Header from "./header";
import Spinner from "../../../../../../components/spinner";
import utils from "./utils";
import CloneWarning from "./bucket/modal";
export default function CloneModal() {
  const { token } = useSelector(({ auth }) => auth),
    { showCloneModal: show, collections: branches } = useSelector(
      ({ branches }) => branches
    ),
    { clone = {}, formSubmitted } = useSelector(({ menus }) => menus),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const mainBranch = branches.find((branch) => branch?.isMain) || {};
      if (mainBranch?._id) {
        const { _id = "", menus = [] } = mainBranch || {};
        dispatch(
          SetCLONE({ ...clone, from: { _id, collections: utils.sort(menus) } })
        );
      }
    }
    // eslint-disable-next-line
  }, [show, branches, dispatch]);

  useEffect(() => {
    const _clone = utils.changeBranch(
      "from",
      clone?.from?._id,
      clone,
      branches,
      true
    );

    dispatch(SetCLONE(_clone));
    //eslint-disable-next-line
  }, [clone.type, dispatch]);
  const toggle = useCallback(() => dispatch(TOGGLE_CLONE()), [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { from, to } = clone;
    const getChanges = (key, obj) => obj.collections.filter((m) => m[key]);
    const fromNew = getChanges("new", from);
    const toNew = getChanges("new", to);
    const fromOverwrite = getChanges("overwrite", from);
    const toOverwrite = getChanges("overwrite", to);
    const toDeleted = to.deleted;
    const fromDeleted = from.deleted;

    dispatch(
      CLONE({
        token,
        data: {
          type: clone.type,
          from: {
            branchId: from._id,
            new: fromNew,
            overwrite: fromOverwrite,
            deleted: fromDeleted,
          },
          to: {
            branchId: to._id,
            new: toNew,
            overwrite: toOverwrite,
            deleted: toDeleted,
          },
        },
      })
    ).then(() => {
      toggle();
      dispatch(
        SetCLONE({
          from: { collections: [], type: "menus", _id: "" },
          to: { collections: [], type: "menus", _id: "" },
          type: "menus",
        })
      );
    });
  };

  return (
    <MDBModal size="xl" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clone" className="mr-2" />
        Clone Product & Services
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow className="mb-1">
            <Header identifier="from" isMain />
            <Header identifier="to" />
          </MDBRow>
          <MDBRow>
            <Bucket identifier="from" />
            <Bucket identifier="to" />
          </MDBRow>
          <div className="text-center">
            <MDBBtn
              className="mt-4"
              color="primary"
              rounded
              type="submit"
              disabled={clone?.to?.collections?.length === 0 || formSubmitted}
            >
              Save <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
        <CloneWarning />
      </MDBModalBody>
    </MDBModal>
  );
}
