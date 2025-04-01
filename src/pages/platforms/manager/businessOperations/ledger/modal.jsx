import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import { Calendar } from "../../../../../services/fakeDb";

export default function Modal({
  show,
  toggle,
  isLoading,
  month: propMonth,
  year: propYear,
  setMonth: setPropMonth,
  setYear: setPropYear,
}) {
  const [month, setMonth] = useState(0),
    [year, setYear] = useState(2023),
    { Months, Years } = Calendar;

  useEffect(() => {
    setMonth(propMonth);
    setYear(propYear);
  }, [propMonth, propYear]);

  const handleSubmit = () => {
    if (month === propMonth && year === propYear) return toggle();

    setPropMonth(month);
    setPropYear(year);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar-alt" className="mr-2" />
        Update Calendar
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBSelect
          getValue={e => setMonth(Number(e[0]))}
          className="colorful-select dropdown-primary mt-2 hidden-md-down"
        >
          <MDBSelectInput selected={`Month: ${Months[month]}`} />
          <MDBSelectOptions>
            {Months.map((month, index) => (
              <MDBSelectOption key={`month-${index}`} value={String(index)}>
                <span className="d-none">Month: </span>
                {month}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
        <MDBSelect
          getValue={e => setYear(Number(e[0]))}
          className="colorful-select dropdown-primary mt-2 hidden-md-down"
        >
          <MDBSelectInput selected={`Year: ${year}`} />
          <MDBSelectOptions>
            {Years.map((year, index) => (
              <MDBSelectOption key={`year-${index}`} value={year}>
                <span className="d-none">Year: </span>
                {year}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
        <div className="text-center mb-1-half">
          <MDBBtn
            onClick={handleSubmit}
            disabled={isLoading}
            color="info"
            className="mb-2"
            rounded
          >
            Submit
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
