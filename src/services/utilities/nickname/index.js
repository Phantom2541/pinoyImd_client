import capitalize from '../capitalize';

const nickname = ({ fname = '', lname = '' }) =>{
  if(!fname && !lname) return '-'

  return `${capitalize(fname.split(' ')[0])} ${String(lname).charAt(0)}.`;
}
  

export default nickname;
