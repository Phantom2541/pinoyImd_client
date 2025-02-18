import Dashboard from "../../../pages/platforms/patron/dashboard";
import Laboratories from "../../../pages/platforms/patron/diagnostics/laboratory";
import Radiologies from "../../../pages/platforms/patron/diagnostics/radiology";

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
        name: "Laboratory",
        path: "/laboratory",
      },
      {
        name: "Radiology",
        path: "/radiology",
      },
      {
        name: "Admission",
        path: "/admission",
      },
    ],
  },
  {
    name: "History",
    path: "/history",
    icon: "user-tie",
  },
  {
    name: "Diagnostics",
    path: "/diagnostics",
    icon: "hospital-alt",
    children: [
      {
        name: "Laboratory",
        path: "/laboratory",
        component: Laboratories,
      },
      {
        name: "Radiology",
        path: "/radiology",
        component: Radiologies,
      },
    ],
  },
];

export default patron;
