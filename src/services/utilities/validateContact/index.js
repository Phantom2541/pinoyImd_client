const validateContact = e => {
  if (
    (e.keyCode >= 48 && e.keyCode <= 58) ||
    (e.keyCode >= 96 && e.keyCode <= 105) ||
    e.keyCode === 8
  ) {
    return true;
  } else {
    e.preventDefault();
  }
};

export default validateContact;
