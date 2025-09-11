import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBPagination, MDBPageItem, MDBPageNav } from "mdbreact";
import { setActivePage } from "../../../../../services/redux/slices/diagnostics/clinician/clinicMenus";

export default function Footer() {
  const dispatch = useDispatch();
  const { filtered, activePage, maxPage } = useSelector(({ clinicMenus }) => clinicMenus);
  const totalPages = Math.ceil(filtered.length / maxPage);

  if (totalPages <= 1) return null;

  return (
    <MDBPagination circle className="mb-0 mt-2 justify-content-center">
      {Array.from({ length: totalPages }).map((_, i) => (
        <MDBPageItem key={i} active={i + 1 === activePage}>
          <MDBPageNav onClick={() => dispatch(setActivePage(i + 1))}>{i + 1}</MDBPageNav>
        </MDBPageItem>
      ))}
    </MDBPagination>
  );
}
