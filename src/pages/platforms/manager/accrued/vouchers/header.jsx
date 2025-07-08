import { useCallback, useEffect, useState } from "react";
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
          INSOURCE({
            token,
            key: { vendors: activePlatform.branchId, status: "approved" },
          })
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
      console.log("source", getProvider(source));
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

    Swal.fire({
      title: "Generate SOA?",
      text: "Are you sure you want to generate a Statement of Account? This will download an Excel file and create a printout.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, generate SOA!",
    }).then((result) => {
      if (result.isConfirmed) {
        const menus = get.menus(cluster);
        const dealIds = cluster.flatMap(({ deals }) =>
          deals.map(({ _id }) => _id)
        );
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

        dispatch(GENERATE_SOA({ data, token }));

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
      }
    });
  };

  const haveSource = vendor?._id && vendor?._id !== "noSource" ? true : false;

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-2 d-flex justify-content-between align-items-center"
    >
      <div>
        <i>Voucher List</i>
      </div>
      <div className="m-0 mt-n1 mr-n5 ">
        <MDBBtn
          size="sm"
          color="warning"
          disabled={!haveSource}
          onClick={handleGenerateSOA}
          title="Generate SOA"
        >
          <MDBIcon icon="file-invoice" className="mr-2" /> Generate SOA
        </MDBBtn>
        <span className="d-block mt-n1 mb-n1" style={{ fontSize: "0.9rem" }}>
          <i>
            Note:
            {haveSource
              ? " You can now generate the SOA."
              : " Select a source to activate Generate SOA."}
          </i>
        </span>
      </div>
      <div className="text-right d-flex align-items-center ">
        <span className="mr-2">Source:</span>
        <select
          style={{ width: "15rem" }}
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
      </div>
    </MDBView>
  );
};

export default Header;
