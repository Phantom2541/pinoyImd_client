import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse, dateFormat } from "../../../../../../services/utilities";

export default function Body() {
  const { filtered, activePage, maxPage } = useSelector(({ deals }) => deals),
    [vouchers, setVouchers] = useState([]),
    [cluster, setCluster] = useState([]);

  useEffect(() => {
    const groupByDate = filtered.reduce((groups, item) => {
      const date = dateFormat(item.createdAt);
      const index = groups.findIndex((group) => group.date === date);
      if (index > -1) {
        groups[index].deals.push({ ...item, isSelected: false });
      } else {
        groups.push({
          date,
          deals: [{ ...item, isSelected: false }],
          isSelected: false,
        });
      }
      return groups;
    }, []);

    setVouchers(groupByDate);
  }, [filtered, activePage, maxPage]);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const handleSelect = (deal) => {
    const _cluster = [...cluster];
    const index = _cluster.findIndex((item) => item._id === deal._id);
    index > -1 ? _cluster.splice(index, 1) : _cluster.push(deal);
    setCluster(_cluster);
  };

  const renderNoData = () => (
    <div className="text-center text-muted py-4">No vouchers available</div>
  );

  const renderVouchers = () =>
    vouchers.map((voucher, index) => {
      const { deals, date } = voucher;
      const actualIndex = index;
      const { color, border } = collapse.getStyle(
        actualIndex,
        activeId,
        didHoverId
      );

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
              count={deals.length}
              sum={deals.reduce((acc, item) => acc + item.amount, 0)}
              isOpen={activeId === actualIndex}
              textColor={color}
              setActiveId={setActiveId}
              index={actualIndex}
            />
          </MDBCollapseHeader>

          <MDBCollapse
            id={`collapse-${actualIndex}`}
            isOpen={actualIndex === activeId}
          >
            <MDBCardBody className="m-0 p-0">
              <CollapsableBody deals={deals} handleSelect={handleSelect} />
            </MDBCardBody>
          </MDBCollapse>
        </MDBCard>
      );
    });

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid>
      {vouchers.length === 0 ? renderNoData() : renderVouchers()}
    </MDBContainer>
  );
}
