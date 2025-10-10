import { useCallback, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBBtn,
} from "mdbreact";
import {
  SetUPDATED_ITEMS_COLLECTIONS,
  TOGGLE_CLONE,
} from "../../../../../../services/redux/slices/assets/branches";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

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
  const { addToast } = useToasts();

  useEffect(() => {
    if (show) {
      const mainBranch = branches.find((branch) => branch?.isMain) || {};
      if (mainBranch?._id) {
        const { _id = "", menus = [] } = mainBranch || {};
        dispatch(
          SetCLONE({
            ...clone,
            from: {
              _id,
              collections: utils.sort(menus),
              type: "menus",
              deleted: [],
            },
            to: { _id: "", collections: [], deleted: [], type: "menus" },
            type: "menus",
          })
        );
      }
    }
    // eslint-disable-next-line
  }, [show, branches, dispatch]);

  useEffect(() => {
    if (show && clone?.from?._id) {
      const _clone = utils.changeBranch(
        "from",
        clone?.from?._id,
        clone,
        branches,
        true
      );

      dispatch(SetCLONE(_clone));
    }
    //eslint-disable-next-line
  }, [clone.type, dispatch, show]);
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
    ).then(({ payload }) => {
      const { data } = payload;
      const { from: src = {}, to: client = {} } = clone;
      const fromBranch = utils.findBranch(src._id, branches);
      const toBranch = utils.findBranch(client._id, branches);
      const changes = [
        {
          branchId: src._id,
          items: utils.finalizeItemsOfBranch(fromBranch, clone.type, data.from),
        },
        {
          branchId: client._id,
          items: utils.finalizeItemsOfBranch(toBranch, clone.type, data.to),
        },
      ];
      const _branches = [...branches];

      changes
        .filter(({ items = [] }) => items.length)
        .forEach(({ branchId, items }) => {
          const index = _branches.findIndex((b) => b._id === branchId);
          console.log("updated index", index);
          if (index > -1) {
            _branches[index] = { ..._branches[index], [clone.type]: items };
          }
        });

      dispatch(SetUPDATED_ITEMS_COLLECTIONS(_branches));
      dispatch(
        SetCLONE({
          from: { collections: [], type: "menus", _id: "", deleted: [] },
          to: { collections: [], type: "menus", _id: "", deleted: [] },
          type: "menus",
        })
      );
      toggle();
      addToast("Successfully Cloned.", {
        appearance: "success",
      });
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
            <Header identifier="from" isMain title="Source Clone" />
            <Header identifier="to" title="Client" />
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
