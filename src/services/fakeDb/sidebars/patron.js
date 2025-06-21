import { Apply, Documents } from "../../../pages/platforms/patron/application";
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
    name: "Electronic Medical Records",
    path: "/emr",
    icon: "user-tag",
    children: [
      {
        name: "Admission",
        path: "/admission",
        icon: "user-tag",
      },
      {
        name: "Diagnostics",
        path: "/diagnostics",
        icon: "user-tag",
        component: Diagnostics,
      },
      {
        name: "Medical Records",
        path: "/laboratory",
        icon: "user-tag",
      },
      {
        name: "Medical Certificates",
        path: "/certificates",
        icon: "user-tag",
      },
    ],
  },
  {
    name: "History",
    path: "/history",
    icon: "user-tie",
  },
  {
    name: "Application",
    path: "/application",
    icon: "user-tag",
    children: [
      {
        name: "Resume",
        path: "/resume",
        icon: "user-tag",
        component: Apply,
      },
      {
        name: "Documents",
        path: "/documents",
        icon: "user-tag",
        component: Documents,
      },
    ],
  },
];

export default patron;
