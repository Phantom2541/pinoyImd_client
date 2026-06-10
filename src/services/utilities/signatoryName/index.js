import properFullname from "../properFullname";

const signatoryName = (fullname) => {
  const formatted = properFullname(fullname);

  if (formatted === "-") return formatted;

  const { postnominal = "", title = "" } = fullname || {};

  if (postnominal || !title) return formatted;

  return `${formatted}, ${String(title).toUpperCase()}`;
};

export default signatoryName;
