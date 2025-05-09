import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const localizer = momentLocalizer(moment);

const departments = ["Laboratory", "Radiology", "Nursing", "Pharmacy"];
const staff = {
  Laboratory: ["John Doe", "Paul Reyes"],
  Radiology: ["Jane Smith"],
  Nursing: ["Maria Santos"],
  Pharmacy: ["Mark Cruz"],
};

const generateShifts = (staffMember, department) => {
  const shifts = [];
  const startDate = moment().startOf("month");

  let shiftsAssigned = 0;
  const maxShiftsPerWeek = 6;

  // Loop through 15 days (or as many as needed)
  for (let i = 0; i < 15; i++) {
    // Limit to 6 shifts per week (3 days)
    if (shiftsAssigned >= maxShiftsPerWeek) continue;

    // Only assign shifts if the staff member has less than 6 shifts in total for the week
    if (shiftsAssigned < maxShiftsPerWeek) {
      // Determine shift type: Opening or Closing, alternating each day
      const isOpeningShift = shiftsAssigned % 2 === 0; // Alternating Open and Close shifts

      if (isOpeningShift) {
        // Opening Shift: 6 AM - 4 PM
        const openingStart = startDate
          .clone()
          .add(i, "days")
          .set({ hour: 6, minute: 0 })
          .toDate();
        const openingEnd = startDate
          .clone()
          .add(i, "days")
          .set({ hour: 16, minute: 0 })
          .toDate();
        shifts.push({
          title: `${staffMember} - Opening Shift`,
          start: openingStart,
          end: openingEnd,
          department,
          staff: staffMember,
        });
      } else {
        // Closing Shift: 8 AM - 6 PM
        const closingStart = startDate
          .clone()
          .add(i, "days")
          .set({ hour: 8, minute: 0 })
          .toDate();
        const closingEnd = startDate
          .clone()
          .add(i, "days")
          .set({ hour: 18, minute: 0 })
          .toDate();
        shifts.push({
          title: `${staffMember} - Closing Shift`,
          start: closingStart,
          end: closingEnd,
          department,
          staff: staffMember,
        });
      }

      shiftsAssigned++; // Increment the number of shifts assigned for this staff member
    }

    // Break if the staff member reaches the 6-shift limit
    if (shiftsAssigned >= maxShiftsPerWeek) break;
  }

  return shifts;
};

const initialEvents = Object.entries(staff).flatMap(([department, members]) =>
  members.flatMap((member) => generateShifts(member, department))
);

export default function StaffSchedule() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState("All");

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule");

    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Start", key: "start", width: 20 },
      { header: "End", key: "end", width: 20 },
      { header: "Department", key: "department", width: 15 },
      { header: "Staff", key: "staff", width: 15 },
    ];

    events.forEach((event) => {
      worksheet.addRow({
        title: event.title,
        start: moment(event.start).format("YYYY-MM-DD HH:mm"),
        end: moment(event.end).format("YYYY-MM-DD HH:mm"),
        department: event.department,
        staff: event.staff,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "staff_schedule.xlsx");
  };

  const departmentStaff =
    selectedDept === "All"
      ? Object.values(staff).flat()
      : staff[selectedDept] || [];

  const filteredEvents = events.filter(
    (e) =>
      (selectedDept === "All" || e.department === selectedDept) &&
      (selectedStaff === "All" || e.staff === selectedStaff)
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h1 className="fs-4 fw-bold">
          Monthly Staff Schedule - 15 Days, Opening & Closing Shifts
        </h1>
        <MDBBtn onClick={handleExport}>Export to Excel</MDBBtn>
      </div>

      <div className="mb-4 d-flex gap-3">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="form-select"
        >
          <option value="All">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="form-select"
        >
          <option value="All">All Staff</option>
          {departmentStaff.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
      </div>

      <MDBCard>
        <MDBCardBody>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
