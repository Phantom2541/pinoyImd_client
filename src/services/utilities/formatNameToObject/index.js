const formatNameToObj = (searchKey, ) => {
 
  const [lname, rest = ""] = searchKey?.toUpperCase()?.split(",").map(s => s.trim()),
  [fname, mname] = rest.split(" Y ").map(s => s.trim())

if (!lname) return {};

if(!mname) return( {lname, fname})

return  { fname, lname, mname } ;;
};

export default formatNameToObj;
