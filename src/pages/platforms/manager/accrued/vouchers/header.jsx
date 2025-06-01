import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterBySOURCE,
  RESET,
  GENERATE_SOA,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBBtn, MDBIcon, MDBView } from "mdbreact";
import {
  INSOURCE,
  SetINSOURCE,
} from "../../../../../services/redux/slices/assets/providers";
import Swal from "sweetalert2";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { collections, month, year, vendor, cluster } = useSelector(
      ({ deals }) => deals
    ),
    { collections: providers } = useSelector(({ providers }) => providers),
    [source, setSource] = useState(""),
    [sources, setSources] = useState([]),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    if (activePlatform?.branchId) {
      dispatch(
        VOUCHERS({
          token,
          key: {
            branchId: activePlatform?.branchId,
          },
        })
      );
    }
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
    if (collections.length > 0) {
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
                cutoff: cutOff,
              }, // value
            ];
          })
        ).values(),
      ];
      console.log("collections", collections);
      setSources(uniqueSource);
      setSource("all");
    }
  }, [collections, providers, getProvider]);

  useEffect(() => {
    if (source) {
      dispatch(
        SetFilterBySOURCE({
          value: source,
          vendor: getProvider(source),
        })
      );
    }
  }, [source, getProvider, dispatch]);

  const handleGenerateSOA = () => {
    if (cluster.length === 0)
      return Swal.fire({
        icon: "warning",
        title: "Action Required",
        text: "Please select at least one voucher before generating the Statement of Account.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

    const menus = [
      ...new Map(
        cluster
          .flatMap(({ deals }) =>
            deals.flatMap(({ cart }) =>
              cart
                .filter(({ menuId }) => menuId?.isProfile)
                .map(({ menuId }) => ({
                  _id: menuId._id,
                  abbr: menuId.abbreviation,
                  packages: menuId.packages,
                }))
            )
          )
          .map((menu) => [menu._id, menu]) // Ensure uniqueness by _id
      ).values(),
    ];

    const dealIds = cluster.flatMap(({ deals }) => deals.map(({ _id }) => _id));

    const gross = cluster.reduce(
      (total, voucher) =>
        total + voucher.deals.reduce((sum, deal) => sum + deal.amount, 0),
      0
    );

    const data = {
      dealIds,
      clientId: vendor._id,
      vendorId: activePlatform.branchId,
      userId: auth._id,
      amount: gross,
    };

    dispatch(GENERATE_SOA({ data, token }));
    localStorage.setItem("vendor", JSON.stringify(vendor));
    localStorage.setItem("soa", JSON.stringify({ menus, gross }));
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
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="" disabled>
            Select a Source
          </option>
          <option value="all">Select all</option>
          {sources?.map((source, index) => {
            const { cutoff = 0, _id = "", displayname = "" } = source;
            var className = "";
            var title = "";

            if (!cutoff) {
              className = "bg-warning text-white";
              title = "No cutoff set for this source";
            }
            if (_id === "NoSource") {
              className = "bg-danger text-white";
              title = "No source available";
            }

            return (
              <option
                key={`source-${index}`}
                className={className}
                value={_id}
                title={title}
              >
                {displayname}
              </option>
            );
          })}
        </select>
        {vendor?._id && vendor?._id !== "noSource" && (
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
