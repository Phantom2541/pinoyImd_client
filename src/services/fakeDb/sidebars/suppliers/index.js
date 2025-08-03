import manager from "./manager";
import admin from "./admin";
import auditor from "./auditor";
import author from "./author";
import accounting from "./accounting";
import carpentry from "./carpentry";
import cashier from "./cashier";
import frontdesk from "./frontdesk";
import humanresources from "./hr";
import procurement from "./procurement";
import utility from "./utility";
import headquarter from "./headquarter";
import serviceengineer from "./serviceengineer";
const suppliers = {
  serviceengineer,
  utility,
  headquarter,
  procurement,
  humanresources,
  frontdesk,
  cashier,
  carpentry,
  author,
  auditor,
  admin,
  accounting,
  manager,
};

export default suppliers;
