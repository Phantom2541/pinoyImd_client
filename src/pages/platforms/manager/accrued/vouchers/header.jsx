import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterBySOURCE,
  RESET,
  SetVOUCHERS,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBBtn, MDBIcon, MDBView } from "mdbreact";
import {
  INSOURCE,
  SetINSOURCE,
} from "../../../../../services/redux/slices/assets/providers";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { collections, month, year, vendor } = useSelector(
      ({ deals }) => deals
    ),
    { collections: providers } = useSelector(({ providers }) => providers),
    [sources, setSources] = useState([]),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    // const fakeDB = localStorage.getItem("vouchers");
    // if (!fakeDB) {
    dispatch(
      VOUCHERS({
        token,
        key: {
          branchId: activePlatform.branchId,
        },
      })
    );
    // } else {
    //   dispatch(SetVOUCHERS(JSON.parse(fakeDB)));
    // }
    return () => dispatch(RESET());
  }, [dispatch, maxPage, activePlatform, auth._id, year, month, token]);

  useEffect(() => {
    if (token) {
      const fakeDB = localStorage.getItem("insource");
      if (!fakeDB) {
        dispatch(
          INSOURCE({ token, key: { vendors: activePlatform.branchId } })
        );
      } else {
        dispatch(SetINSOURCE(JSON.parse(fakeDB)));
      }
    }
  }, [token, activePlatform, dispatch]);

  const getProvider = useCallback(
    (sourceId) => {
      const foundProvider = providers.find(
        ({ clients }) => String(clients?._id) === String(sourceId)
      );
      const { cutoff, clients } = foundProvider || { cutoff: 0, clients: {} };
      return { cutoff, ...clients };
    },

    [providers]
  );

  useEffect(() => {
    if (collections.length > 0 && providers.length > 0) {
      const uniqueSource = [
        ...new Map(
          collections.map(({ source = {} }) => {
            const { _id = "", displayname = "No tag source" } = source || {};
            const matchedProvider = getProvider(_id);
            const cutOff = matchedProvider?.cutoff || 0;
            return [
              _id || "NoSource", // key
              {
                _id: _id || "NoSource",
                displayname: `${displayname} (${cutOff})`,
              }, // value
            ];
          })
        ).values(),
      ];

      setSources(uniqueSource);
    }
  }, [collections, providers, getProvider]);

  const handleGenerateSOA = () => {
    window.open(
      "/printout/soa",
      "OutsourceRequestForm", // Unique window name 2
      "top=100px,left=0px,width=1050px,height=750px"
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div>
        <i>Voucher List</i>
      </div>
      <div className="text-right d-flex align-items-center ">
        <select
          id="cashier-select"
          className="custom-select mr-2"
          onChange={(e) =>
            dispatch(
              SetFilterBySOURCE({
                value: e.target.value,
                vendor: getProvider(e.target.value),
              })
            )
          }
        >
          <option value="" disabled>
            Select a Source
          </option>
          <option value="all">Select all</option>
          {sources?.map((source, index) => (
            <option key={`source-${index}`} value={source?._id}>
              {source?.displayname}
            </option>
          ))}
        </select>
        {vendor?._id && vendor._id !== "noSource" && (
          <MDBBtn
            size="sm"
            color="primary"
            className="px-2 m-0 ml-1"
            onClick={handleGenerateSOA}
            rounded
            title="Generate SOA"
          >
            <MDBIcon icon="print" />
          </MDBBtn>
        )}
      </div>
    </MDBView>
  );
};

export default Header;
