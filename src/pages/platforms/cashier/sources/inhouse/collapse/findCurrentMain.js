const findCurrentMain = (collections, user) => {
  const found = collections
    .flatMap(({ affiliated }) => affiliated)
    .find(({ user: u, isMajor = false }) => u?._id === user?._id && isMajor);
  const currentMain = collections.find(({ _id }) => _id === found?.branch);
  return { found, currentMain };
};

export default findCurrentMain;
