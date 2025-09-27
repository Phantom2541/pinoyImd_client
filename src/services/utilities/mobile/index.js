const contacts = (contact) => {
  if (!contact) return "-";

  let digits = contact.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 11) {
    digits = "63" + digits.slice(1);
  } else if (digits.startsWith("9") && digits.length === 10) {
    digits = "63" + digits;
  } else if (digits.startsWith("63") && digits.length === 12) {
    // valid
  } else {
    return (
      <>
        <div
          style={{ fontSize: "1em", color: "gray", margin: 0, lineHeight: 1 }}
        >
          {contact.slice(0, 4)}&nbsp;
          {contact.slice(4, 8)}-{contact.slice(8, 12)}
        </div>
        <div
          style={{ color: "red", fontWeight: "bold", margin: 0, lineHeight: 1 }}
        >
          Invalid number
        </div>
      </>
    );
  }

  return `+${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(
    5,
    8
  )}-${digits.slice(8, 12)}`;
};

export default contacts;
