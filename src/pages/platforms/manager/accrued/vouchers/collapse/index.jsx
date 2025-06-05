import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBTypography,
} from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse } from "../../../../../../services/utilities";
import { SetCluster } from "../../../../../../services/redux/slices/commerce/pos/services/deals";

export default function Body() {
  const { filtered, vendor, cluster } = useSelector(({ deals }) => deals),
    [vouchers, setVouchers] = useState([]),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetCluster(filtered));
    setVouchers(filtered);
  }, [filtered, dispatch]);

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
  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid>
      {!vendor?._id && (
        <div style={{ marginTop: "-1.5rem", marginBottom: "-0.5rem" }}>
          <MDBTypography noteTitle="Description: " note noteColor="warning">
            Please select a source before generating the SOA.
          </MDBTypography>
        </div>
      )}
      {vouchers?.map((voucher, index) => {
        const { deals = [], date } = voucher;
        const actualIndex = index; // Directly use the index in the paginated data
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );
        return (
          <MDBCard
            key={`vouchers-${date}-${index}`}
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
                deals={deals}
                title={date}
                isChecked={isChecked(date)}
                count={deals?.length}
                sum={deals.reduce((acc, item) => acc + item.amount, 0)}
                isOpen={activeId === actualIndex}
                textColor={color}
                setActiveId={setActiveId}
                index={actualIndex}
              />
            </MDBCollapseHeader>

            <MDBCollapse
              id={`collapse-${actualIndex}`}
              isOpen={actualIndex === activeId} // Only open if the current ID matches activeId
            >
              <MDBCardBody className=" m-0 p-0">
                <CollapsableBody
                  deals={deals}
                  isChecked={isChecked}
                  date={date}
                />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
