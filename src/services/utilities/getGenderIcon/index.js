// const emojis = {
//   physician: {
//     male: "👨‍⚕️",
//     female: "👩‍⚕️",
//   },
//   employee: {
//     male: "👨‍🔬",
//     female: "👩‍🔬",
//   },
//   board: {
//     male: "👨‍💼",
//     female: "👩‍💼",
//   },
//   patient:{
//     male: "👨",
//     female: "👩",
//   }
// };

const getPhysicianGenderIcon = (isMale, isGhost) => (
  <span style={{ fontSize: "20px" }}>
    {isGhost ? "👻" : isMale ? "👨‍⚕️" : "👩‍⚕️"}
  </span>
);

// const getGenderIcon= (category="patient",isMale) => (
//   <span style={{ fontSize: "20px" }} title={isMale ? "Male" : "Female"}>
//     {emojis[category][isMale ? "male" : "female"]}
//   </span>
// );

const getGenderIcon = (isMale) => (
  <span style={{ fontSize: "20px" }} title={isMale ? "Male" : "Female"}>
    {isMale ? "♂️" : "♀️"}
  </span>
);

export { getPhysicianGenderIcon, getGenderIcon };
