import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBIcon,
} from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse, dateFormat } from "../../../../../../services/utilities";
import {
  SetSoaCluster,
  RESET,
  GENERATE_SOA,
} from "../../../../../../services/redux/slices/commerce/pos/services/billing";
import get from "../utils";
import { RemoveVERIFIED_SOA } from "../../../../../../services/redux/slices/finance/journals/payables";

export default function Body() {
  const { token } = useSelector(({ auth }) => auth),
    {
      filtered,
      activePage,
      maxPage,
      cluster,
      formSubmitted,
      isSuccess,

      vendor,
    } = useSelector(({ billings }) => billings),
    [soa, setSoa] = useState([]),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  useEffect(() => {
    const groupByDate = filtered.reduce((groups, item) => {
      const date = dateFormat(item.createdAt);
      const index = groups.findIndex((group) => group.date === date);
      if (index > -1) {
        groups[index].deals.push(item);
      } else {
        groups.push({
          date,
          deals: [item],
        });
      }
      return groups;
    }, []);

    setSoa(groupByDate);
  }, [filtered, activePage, maxPage]);

  useEffect(() => {
    dispatch(SetSoaCluster(soa));
  }, [soa, dispatch]);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      setSelected({});
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, dispatch]);

  const isChecked = (date, deal) => {
    if (cluster.length > 0) {
      const _cluster = [...cluster];
      const findCluster = _cluster.find((item) => item?.date === date);
      if (!deal?._id) return findCluster?.hasSelected;
      const { deals = [] } = findCluster || {};
      return deals?.some(({ _id }) => deal._id === _id) || false;
    }
    return false;
  };
  const { soa: s } = vendor;
  const canGenerateSOA = s?.amount === get.totalAmount(cluster);

  const handleGenerateSOA = () => {
    const dealIDS = cluster.flatMap(({ deals }) => deals.map(({ _id }) => _id));
    dispatch(GENERATE_SOA({ token, data: { dealIDS, bill: s._id } })).then(
      ({ payload }) => {
        const { payload: data } = payload;
        dispatch(RemoveVERIFIED_SOA(data.bill));
      }
    );
  };
  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginTop: "-1.2rem", marginBottom: "1rem" }}
      >
        {s && <> {get.description(vendor, cluster)}</>}
        {canGenerateSOA && (
          <MDBBtn size="sm" rounded color="primary" onClick={handleGenerateSOA}>
            <MDBIcon icon="file-invoice-dollar" className="mr-2" />
            Generate SOA{" "}
            {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        )}
      </div>
      {soa?.map(({ date, deals }, index) => {
        const actualIndex = index;
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );
        const sum = deals.reduce((acc, item) => {
          return acc + (item?.sendouts?.up || 0);
        }, 0);
        return (
          <MDBCard
            key={`service-${date}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={border}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(actualIndex)}
              style={{ borderRadius: "50%" }}
            >
              <CollapsableHeader
                key={date}
                title={date}
                deals={deals}
                count={deals.length}
                isChecked={isChecked(date)}
                sum={sum}
                isOpen={activeId === actualIndex}
                textColor={color}
                setActiveId={setActiveId}
                index={actualIndex}
              />
            </MDBCollapseHeader>

            <MDBCollapse
              id={`collapse-${actualIndex}`}
              className="mb-2 border border-black"
              isOpen={actualIndex === activeId} // Only open if the current ID matches activeId
            >
              <MDBCardBody className="m-0 p-0">
                <CollapsableBody
                  deals={deals}
                  date={date}
                  selected={selected}
                  setSelected={setSelected}
                  isChecked={isChecked}
                />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
