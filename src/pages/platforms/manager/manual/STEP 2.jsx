import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function InitialSetupGuide() {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);
  const branchId =
    activePlatform?.branchId ||
    activePlatform?.branch?._id ||
    activePlatform?.branch ||
    "";
  const platformPrefix = `/${String(
    activePlatform?.platform || "manager"
  ).toLowerCase()}`;
  const category = String(activePlatform?.branch?.category || "").toLowerCase();
  const diagnosticsCategories = [
    "diagnostic",
    "clinic",
    "laboratory",
    "radiology",
    "pharmacy",
    "infirmary",
    "hospital",
    "rehabilitation",
  ];
  const isDiagnostics = diagnosticsCategories.includes(category);
  const staffApplicationLink = `${window.location.origin}/subscribers/${branchId}`;

  const steps = [
    {
      title: "Menu (Price Declarations)",
      action: "Add, edit, or update initial prices",
      path: "Branch Config -> Product & Services Setup -> Menu",
      route: `${platformPrefix}/config/product-config/menus`,
      suggestion: "Start with Chemistry & Serology, then add more as needed",
    },
    {
      title: "Services (Reference Values)",
      action: "Update reference values (esp. Chemistry & Serology)",
      path: "Branch Config -> Product & Services Setup -> Services",
      route: `${platformPrefix}/config/product-config/services`,
      suggestion: "Ensure all reference values are accurate and up-to-date",
    },
    {
      title: "Staff",
      action: "Review applications and assign positions/access",
      path: "Human Resources -> Applicants",
      route: `${platformPrefix}/hr/petitioners`,
      suggestion: "Verify credentials and conduct interviews before assignment",
    },
    {
      title: "Signatories",
      action: "Encode and upload signatories (MedTech, Pathologist, etc.)",
      path: isDiagnostics
        ? "Human Resources -> Signatories"
        : "Branch Config -> Profile Settings -> Signatories",
      route: isDiagnostics
        ? `${platformPrefix}/hr/signatories`
        : `${platformPrefix}/config/profile/signatories`,
    },
    {
      title: "Sources",
      action: "Register outsource, insource, utilities, or hotlines",
      path: "Branch Config -> Sources & Utilities",
      route: `${platformPrefix}/config/sources`,
    },
  ];

  return (
    <>
      <h3 className="mt-4">Step 2: Initial Setup (Configuration)</h3>

      <p>
        Once registered, log in to your <b>Manager Platform</b> and complete the
        initial setup below.
        <br />
        <br />
        <b>Recommended:</b> Ask your department heads and key personnel to
        create their own accounts and sign in to the system. They should
        navigate to <i>Job Application</i> from the sidebar, locate your
        company, and submit their applications. Once submitted, you may review,
        approve, and assign the appropriate positions, roles, and system access
        permissions.
        <MDBBtn
          tag="a"
          href={staffApplicationLink}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          size="sm"
          className="mb-0"
        >
          <MDBIcon icon="external-link-alt" className="mr-2" />
          Share this link with your staff to apply for accounts
        </MDBBtn>
      </p>

      <ol>
        {steps.map(({ title, action, path, route }, index) => (
          <li key={index} className="mt-2">
            <b>{title}</b>
            <br />
            {action}
            <br />
            Path:{" "}
            <Link to={route}>
              <i>{path}</i>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
