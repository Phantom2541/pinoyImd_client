import Bulletin from "../../../../pages/platforms/cashier/bulletin";
import {
  Cashier,
  Deals,
  Menus,
  Services,
  Inhouse,
  Contract,
  Membership,
  Outsources,
  Utilities,
  Wellness,
  Referrals,
  Remittances,
  Hotlines,
  // HotlinesPoster,
  Suppliers,
  Payables,
  Receivables,
  Vouchers,
  Payments,
  // SOA,
  ExpressLane,
  Preauthorization,
} from "../../../../pages/platforms/cashier";
import {
  Request,
  Clearance,
  Certification,
} from "../../../../pages/platforms/frontdesk/forms";

const cashier = [
  {
    name: "Bulletin",
    icon: "bullhorn",
    path: "/bulletin",
    title: "News and Updates",
    component: Bulletin,
  },
  {
    name: "Cash Register",
    path: "/cash/register",
    icon: "cash-register",
    title: "Cash Register Functions",
    children: [
      {
        name: "Self-Pay P O S",
        path: "/pos",
        icon: "shopping-cart",
        title: "Point of Sales",
        component: Cashier,
      },
      // online payments and billing will be handled by frontdesk, cashier will only handle walk-in transactions and pre-authorization
      {
        name: "H M O  P O S",
        path: "/authorization",
        icon: "check-circle",
        // Letter of Authorization (LOA))
        // Covered ba ang specific test/procedure? May LOA ba?
        title:
          "Pre-authorization for HMO-covered services → check specific service if covered by HMO -> LOA ",
        component: Preauthorization,
      },

      {
        name: "PhilHealth P O S",
        path: "/express-lane",
        icon: "sign-in-alt",
        // Qualified ba ang case/service para sa PhilHealth benefit?
        title:
          "Express Lane for PhilHealth → check if case/service is qualified for PhilHealth benefit",

        component: ExpressLane,
      },
      // Pre-charged → moves to Accrued Vouchers/frontdesk onboarding when done
      {
        name: "Daily Deals",
        path: "/daily/deals",
        icon: "tags",
        title: "Service Deals of the Day",
        component: Deals,
      },
      {
        name: "Remittances",
        path: "/remittances",
        icon: "exchange-alt",
        title: "Daily Remittance Ledger",
        component: Remittances,
      },
    ],
  },
  {
    name: "Accrued",
    path: "/accrued",
    icon: "file-invoice",
    title: "Liabilities and Obligations",
    children: [
      {
        name: "Accounts Payable (A/P)",
        path: "/payables",
        icon: "file-invoice-dollar",
        title: "Outstanding Payments to Suppliers & Utilities",
        component: Payables,
      },
      // {
      //   name: "Petty Cash Vouchers",
      //   path: "/payments/petty-vouchers",
      //   icon: "file-invoice-dollar",
      //   title:
      //     "Small disbursements for minor expenses (transport, meals, allowances)",
      // },
      {
        name: "Payments",
        path: "/payments",
        icon: "money-check-alt",
        title: "List of Payments Made by cashier",
        component: Payments,
      },
      {
        name: "Accounts Receivable (A/R)",
        path: "/receivables",
        icon: "wallet",
        title: "Billing for Corporate & HMO Invoices",
        component: Receivables,
      },
      {
        name: "Service Credit Vouchers",
        path: "/cashier/service-vouchers",
        icon: "receipt",
        title: "Recorded Monthly Vouchers for Referrals (Cashier only)",
        component: Vouchers,
      },
    ],
  },
  {
    name: "Sources",
    path: "/sources",
    icon: "building",
    title: "Outsources & Insources",
    children: [
      {
        name: "Outsources",
        path: "/outsources",
        icon: "people-carry",
        title: "External Service Providers (Sendout)",
        component: Outsources,
      },
      {
        name: "Affiliated Patient Programs",
        path: "/insources",
        icon: "hand-holding-heart",
        title: "Patient Sources with Discounts or Privileges",
        children: [
          {
            name: "H M O Wellness",
            path: "/wellness",
            icon: "briefcase-medical",
            title: "Partner Companies with HMO Coverage",
            component: Wellness,
          },
          {
            name: "Inhouse",
            path: "/inhouse",
            icon: "user-md",
            title: "list of inhouse providers (Branches)",
            component: Inhouse,
          },
          {
            name: "Membership Privileges",
            path: "/membership",
            icon: "id-card-alt",
            title: "Members with Discounted Rates",
            component: Membership,
          },
          {
            name: "Contract",
            path: "/contract",
            icon: "paper-plane",
            title: "Clinics or Doctors Who Referred Patients",
            component: Contract,
          },
          {
            name: "Referral Sources",
            path: "/referrals",
            icon: "paper-plane",
            title: "Clinics or Doctors Who Referred Patients",
            component: Referrals,
          },
        ],
      },
      {
        name: "Suppliers",
        path: "/suppliers",
        icon: "boxes",
        title: "Suppliers for Goods & Services",
        component: Suppliers,
      },
      {
        name: "Utilities",
        path: "/utilities",
        icon: "plug",
        title: "Utilities & Support Services",
        component: Utilities,
      },
      {
        name: "Hotlines",
        path: "/hotlines/bread",
        icon: "phone-alt",
        title: "Emergency Hotlines",
        component: Hotlines,
      },
    ],
  },
  {
    name: "Services Catalog",
    path: "/catalogs",
    icon: "clipboard-list",
    title: "Service Listings",
    children: [
      {
        name: "Menus",
        path: "/menus",
        icon: "utensils",
        title: "List of Menus",
        component: Menus,
      },
      {
        name: "Services",
        path: "/services",
        icon: "concierge-bell",
        title: "List of Services",
        component: Services,
      },
    ],
  },
  {
    name: "Request Form",
    path: "/forms",
    icon: "clipboard-list",
    title: "downloadable forms",
    children: [
      {
        name: "Physician's Order Form",
        path: "/request",
        icon: "file-medical",
        title: "Physician's Order Form template",
        component: Request,
      },
      {
        name: "MEDICAL EXAMINATION CLEARANCE",
        path: "/clearance",
        icon: "file",
        title: "Medical Examination Clearance template",
        component: Clearance,
      },
      {
        name: "PHYSICAL EXAMINATION REPORT",
        path: "/certification",
        icon: "file",
        title: "Physical Examination Report template",
        component: Certification,
      },
    ],
  },
  // {
  //   name: "Hotlines",
  //   path: "/hotlines",
  //   icon: "phone-alt",
  //   title: "Emergency Hotlines Poster",
  //   component: HotlinesPoster,
  // },
];

export default cashier;
