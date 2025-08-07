import React, { useState, useEffect } from "react";
import Header from "./header";
import Body from "./body";
import CaseModal from "./modal";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/commerce/pos/services/cases";

export default function CaseIndex() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState({});
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (token) {
      dispatch(BROWSE({ token, params: { branchId: activePlatform.branchId } }));
    }
  }, [token, activePlatform, dispatch]);

  const handleAdd = () => {
    setSelected({});
    setModal(true);
  };

  const handleEdit = (item) => {
    setSelected(item);
    setModal(true);
  };

  return (
    <>
      <Header onAdd={handleAdd} />
      <Body onEdit={handleEdit} />
      <CaseModal modal={modal} toggle={() => setModal(false)} selected={selected} />
    </>
  );
}
