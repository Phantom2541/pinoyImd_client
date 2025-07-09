import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterBySOURCE,
  RESET,
  GENERATE_SOA,
  SetFILTERBY,
  SetFilterByCARD,
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
import { HMO } from "../../../../../services/fakeDb";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const {
      collections,
      month,
      year,
      vendor,
      cluster,
      filterBy,
      hmo: baseHMO,
    } = useSelector(({ deals }) => deals),
    { collections: providers } = useSelector(({ providers }) => providers),
    [filterOption, setFilterOption] = useState(""),
    [sources, setSources] = useState([]),
    [hmo, setHmo] = useState([]),
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
      const uniqueHMO = [
        ...new Set(collections.map(({ hmo }) => hmo).filter((a) => a)),
      ];
      setHmo(uniqueHMO);
      setSources(uniqueSource);
      setFilterOption("all");
    }
  }, [collections, providers, getProvider]);
  const filterBySource = filterBy === "source";
  const haveSelect =
    (filterBySource
      ? vendor?._id && vendor?._id !== "noSource"
      : baseHMO !== "all") && cluster?.length > 0;

  const baseChoices = filterBySource ? sources : hmo;

  useEffect(() => {
    setFilterOption(
      JSON.parse(localStorage.getItem("cluster"))?.lastViewed || "all"
    );
  }, [filterBy]);

  useEffect(() => {
    if (filterOption && collections.length > 0) {
      dispatch(
        filterBySource
          ? SetFilterBySOURCE({
              value: filterOption,
              vendor: getProvider(filterOption),
            })
          : SetFilterByCARD(filterOption)
      );

      localStorage.setItem(
        "cluster",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("cluster") || "{}"),
          lastViewed: filterOption,
        })
      );
    }
  }, [filterOption, getProvider, dispatch, collections, filterBySource]);

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
        const customerCount = cluster.reduce(
          (total, voucher) => total + voucher.deals.length,
          0
        );
        const isSource = filterBy === "source";

        const data = {
          dealIds,
          ...(isSource ? { clientId: vendor?._id } : { hmo: baseHMO }),
          vendorId: activePlatform.branchId,
          userId: auth._id,
          amount: gross,
        };
        const dateRange = get.dateRange({ vendor, cluster, isSource });
        const options = {
          isSource,
          customerCount,
          fileName: get.fileName({ vendor, cluster, isSource, hmo: baseHMO }),
          dateRange,
          name: isSource ? get.name(vendor) : HMO.getName(baseHMO),
          due: get.due(vendor),
          gross,
          createdBy: fullName(auth.fullName),
          address: billingAddress(vendor.address),
          ...(!isSource && { cp: HMO.getCP(baseHMO) }),
        };

        dispatch(GENERATE_SOA({ data, token }));

        localStorage.setItem(
          "filterEntity",
          JSON.stringify(`${filterBy}.${filterOption}`)
        );
        localStorage.setItem("soa", JSON.stringify({ gross, options }));
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

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div>
        <i>Voucher List</i>
      </div>
      <div className="m-0  mr-n5">
        <MDBBtn
          size="sm"
          color="warning"
          disabled={!haveSelect}
          onClick={handleGenerateSOA}
          title="Generate SOA"
        >
          <MDBIcon icon="file-invoice" className="mr-2" /> Generate SOA
        </MDBBtn>
      </div>
      <div className="text-right d-flex align-items-center ">
        <select
          className="form-control"
          style={{ width: "6rem" }}
          value={filterBy}
          onChange={({ target }) => {
            setFilterOption("all");
            dispatch(SetFILTERBY(target.value));
          }}
        >
          <option value="source">Source</option>
          <option value="card">Card</option>
        </select>
        :
        <select
          style={{ width: "15rem" }}
          className="form-control mr-2"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="all">Select all</option>
          {baseChoices?.map((choice, index) => {
            const { cutoff = 0, _id = "", displayname = "" } = choice || {};
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
            const value = filterBySource ? _id : choice;
            const text = filterBySource ? displayname : HMO.getName(choice);

            return (
              <option
                key={`source-${index}`}
                className={filterBySource ? className : ""}
                value={value}
                title={title}
              >
                {text}
              </option>
            );
          })}
        </select>
      </div>
    </MDBView>
  );
};

export default Header;
