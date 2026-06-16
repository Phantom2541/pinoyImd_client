import { Menus } from "../../../../pages/platforms/physician";
import { Services } from "../../../../pages/platforms/cashier";
import Appointments from "../../../../pages/platforms/clinical/appointment";
import Billing from "../../../../pages/platforms/clinical/billing";
import Schedules from "../../../../pages/platforms/clinical/schedules";

const clinical = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/clinical/bulletin",
  },
  {
    name: "Clinic Desk",
    path: "/consultations",
    icon: "stethoscope",
    children: [
      {
        name: "Appointments",
        path: "/appointments",
        icon: "calendar-check",
        title: "Booking, check-in, queue, cancelled, done",
        component: Appointments,
      },
      {
        name: "Billing",
        path: "/billing",
        icon: "cash-register",
        title: "Consultation payment and POS",
        component: Billing,
      },
      {
        name: "Daily Collections",
        path: "/collections",
        icon: "cash-register",
        title: "Consultation payment and POS",
        // component: POS,
      },
      {
        name: "Patient Records",
        path: "/records",
        icon: "folder-open",
        title: "Search and view patient records",
        // component: Records,
      },
      {
        name: "Physician Schedule",
        path: "/schedules",
        icon: "calendar-alt",
        title: "Doctor clinic schedule and availability",
        component: Schedules,
      },
    ],
  },
  {
    name: "Services", //viewing only
    path: "/offers",
    icon: "list",
    children: [
      /**
       * a group of related services
       */
      {
        name: "Menus",
        path: "/menus",
        icon: "cogs",
        component: Menus,
      },
      /**
       *  a single service
       */
      {
        name: "examinations",
        path: "/services",
        icon: "tools",
        component: Services,
      },
    ],
  },
  {
    name: "Liability",
    path: "/liability",
    icon: "tv",
    children: [
      {
        name: "Supply",
        title: "stocks",
        icon: "box",
        path: "/liability/supply",
      },
    ],
  },
  {
    name: "Merchandise",
    icon: "list",
    children: [
      {
        name: "Products",
        icon: "cogs",
        path: "/clinical/offers/menus",
      },
      {
        name: "Stocks",
        icon: "tools",
        path: "/clinical/merchandise/stocks",
      },
    ],
  },
];

export default clinical;
