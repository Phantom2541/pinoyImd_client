import collections from "./collections.json";
 
 const Policy = {
  collections,
  getDepartment:(pk)=>{
   const {code,positions}=collections.find(({positions=[]})=>positions.some(({id})=>id===pk))
   if(!code) return "unknown designation"
   const role= [...positions].find(({ id }) => id === pk).display_name
   return {department:code,role}
  }
};
export default Policy;
