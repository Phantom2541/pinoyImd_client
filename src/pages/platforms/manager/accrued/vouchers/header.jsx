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
import {
  billingAddress,
  dateFormat,
  fullName,
  VouchersToExcel,
} from "../../../../../services/utilities";
import get from "./utils";
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
            status: "approved",
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

      const { cutoff, clients, due } = foundProvider || {
        cutoff: 0,
        clients: {},
      };
      return { cutoff, due, ...clients };
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
            const { cutoff = 0, due = 0 } = matchedProvider;
            return [
              _id || "NoSource", // key
              {
                _id: _id || "NoSource",
                displayname: `${displayname} (${cutoff})`,
                cutoff: cutoff,
                due,
              }, // value
            ];
          })
        ).values(),
      ];
      setSources(uniqueSource);
      setSource("all");
    }
  }, [collections, providers, getProvider]);

  useEffect(() => {
    if (source && collections.length > 0) {
      dispatch(
        SetFilterBySOURCE({
          value: source,
          vendor: getProvider(source),
        })
      );
    }
  }, [source, getProvider, dispatch, collections]);

  const handleGenerateSOA = () => {
    if (cluster.length === 0)
      return Swal.fire({
        icon: "warning",
        title: "Action Required",
        text: "Please select at least one voucher before generating the Statement of Account.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

    const menus = get.menus(cluster);
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
    const dateRange = get.dateRange(vendor, cluster);

    const options = {
      fileName: get.fileName(vendor, cluster),
      dateRange,
      name: get.name(vendor),
      due: get.due(vendor),
      gross,
      createdBy: fullName(auth.fullName),
      address: billingAddress(vendor.address),
    };
    // dispatch(GENERATE_SOA({ data, token }));

    localStorage.setItem("vendor", JSON.stringify(vendor));
    localStorage.setItem("soa", JSON.stringify({ menus, gross, options }));
    window.open(
      "/printout/soa",
      "OutsourceRequestForm", // Unique window name 2
      "top=100px,left=0px,width=1050px,height=750px"
    );
    setTimeout(() => {
      VouchersToExcel({ array: cluster, menus, options });
    }, 1000);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div>
        <i>Voucher List</i>
      </div>
      <div
        className="text-right d-flex align-items-center "
        style={{ width: "20rem" }}
      >
        <select
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
