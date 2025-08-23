const utils = {
  getSignatories: (collections) => {
    const signatory = (designation) =>
      collections.find(({ contract }) => contract?.designation === designation)
        ?.user || null;

    return [signatory(41), null, signatory(42)];
  },
};

export default utils;
