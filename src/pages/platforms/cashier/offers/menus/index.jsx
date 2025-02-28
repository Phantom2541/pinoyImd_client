import React, { useState, useEffect } from "react";
import { MDBAnimation, MDBBadge } from "mdbreact";
import DataTable from "./../../../../../components/dataTable";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  RESET,
} from "./../../../../../services/redux/slices/commerce/menus";
import { currency, globalSearch } from "./../../../../../services/utilities";
import { Services } from "../../../../../services/fakeDb";

export default function Menus() {
  const [menus, setMenus] = useState([]),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ menus }) => menus
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  console.log(activePlatform);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({ token, params: { branchId: activePlatform?.branchId } })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    setMenus(collections);
  }, [collections]);

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setMenus(globalSearch(collections, key));
    } else {
      setMenus(collections);
    }
  };

  return (
    <MDBAnimation type="slideInLeft">
      <DataTable
        disablePageSelect
        disableSelect
        minHeight="375px"
        isLoading={isLoading}
        title="Menus"
        array={menus}
        tableHeads={[
          {
            _text: "Name",
          },
          {
            _text: "Services",
          },
          {
            _text: "SRP",
          },
        ]}
        tableBodies={[
          {
            _isEmpty: true,
            _key: "description",
            _format: (data, { abbreviation }) => (
              <>
                <p className="fw-bold mb-1">
                  {String(data || abbreviation).toUpperCase()}
                </p>
                {data && <p className="mb-0">{abbreviation.toUpperCase()}</p>}
              </>
            ),
          },
          {
            _isEmpty: true,
            _key: "packages",
            _format: (data) => (
              <p className="fw-bold mb-1">
                {data.map((key, index) => (
                  <MDBBadge
                    pill
                    key={`${key}-service-${index}`}
                    className="pt-1"
                  >
                    {Services.find(key)?.name
                      ? Services.find(key)?.abbreviation
                      : Services.find(key)?.name}
                  </MDBBadge>
                ))}
              </p>
            ),
          },
          {
            _key: "opd",
            _format: (data, { abbreviation }) =>
              data ? (
                currency(data)
              ) : (
                <i>This item has no price for {abbreviation}.</i>
              ),
          },
        ]}
        handleSearch={handleSearch}
        isLocal={true}
      />
    </MDBAnimation>
  );
}
