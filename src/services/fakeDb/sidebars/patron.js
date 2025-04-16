// import UnsetApply from "../../../pages/platforms/patron/apply";
import Dashboard from "../../../pages/platforms/patron/dashboard";
import { Diagnostics } from "../../../pages/platforms/patron/echart";

const patron = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "e-chart",
    path: "/echart",
    icon: "user-tag",
    children: [
      {
        name: "Admission",
        path: "/admission",
      },
      {
        name: "Diagnostics",
        path: "/diagnostics",
        component: Diagnostics,
      },
      {
        name: "Medical Records",
        path: "/laboratory",
      },
      {
        name: "Medical Certificates",
        path: "/certificates",
      },
    ],
  },
  {
    name: "History",
    path: "/history",
    icon: "user-tie",
  },
  {
    name: "Apply",
    path: "/apply",
    icon: "paper-plane",
    // component: UnsetApply,
  },
];

export default patron;
