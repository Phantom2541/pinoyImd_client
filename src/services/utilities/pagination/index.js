const handlePagination = (array, page, max, getPage) => {
  if (getPage) return array;

  return array.slice((page - 1) * max, max + (page - 1) * max);
};

// const getNumOfPagination

export default handlePagination;
