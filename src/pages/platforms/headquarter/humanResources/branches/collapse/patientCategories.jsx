import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { useEffect, useState } from "react";
import { Categories } from "../../../../../../services/fakeDb";

const PatientCategories = ({ branch }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(branch?.pc || []);
  }, [branch]);
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Category</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {categories.map((category, index) => {
          const { name } = Categories[category];
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{name}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
};

export default PatientCategories;

// import { useState } from "react";
// import {
//   MDBBadge,
//   MDBBtn,
//   MDBBtnGroup,
//   MDBIcon,
//   MDBListGroup,
//   MDBListGroupItem,
// } from "mdbreact";
// import { Categories } from "../../../../../../services/fakeDb";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   UPDATE,
//   RESET,
// } from "../../../../../../services/redux/slices/assets/branches";
// import Spinner from "../../../../../../components/spinner";

// const PatientCategories = ({ branch, isOpen = false }) => {
//   const { token } = useSelector(({ auth }) => auth),
//     { formSubmitted, isSuccess } = useSelector(({ branches }) => branches),
//     [showChoices, setShowChoices] = useState(false),
//     [categories, setCategories] = useState([]),
//     dispatch = useDispatch();

//   useEffect(() => {
//     setShowChoices(false);
//     setCategories(branch?.pc || []);
//   }, [branch, isOpen]);

//   useEffect(() => {
//     if (isOpen && !formSubmitted && isSuccess) {
//       setShowChoices(false);
//       dispatch(RESET());
//     }
//   }, [formSubmitted, isSuccess, isOpen, dispatch]);

//   const handleUpdate = () => {
//     dispatch(UPDATE({ token, data: { _id: branch._id, pc: categories } }));
//   };

//   return (
//     <div key={branch._id} className="transition-all">
//       <div className="d-flex align-items-center">
//         <MDBListGroup
//           style={{ height: "40px", overflowX: "auto", whiteSpace: "nowrap" }}
//           className="d-flex flex-row"
//         >
//           <MDBListGroupItem
//             style={{ minWidth: "100px" }}
//             className={`d-flex justify-content-between  align-items-center rounded py-2 mx-2 h-100 cursor-pointer ${
//               true && "bg-primary text-white"
//             }`}
//           >
//             <b className="mr-2"> Personnel List</b>
//             <MDBBadge color={true ? "light" : "primary"} className="pt-1" pill>
//               2
//             </MDBBadge>
//           </MDBListGroupItem>
//         </MDBListGroup>
//         <MDBListGroup
//           style={{ height: "40px", overflowX: "auto", whiteSpace: "nowrap" }}
//           className="d-flex flex-row"
//         >
//           <MDBListGroupItem
//             style={{ minWidth: "100px" }}
//             className={`d-flex justify-content-between  align-items-center rounded py-2 mx-2 h-100 cursor-pointer ${"asdf"}`}
//           >
//             <b className="mr-2">Patient Categories</b>
//             <MDBBadge color={"light"} className="pt-1" pill>
//               2
//             </MDBBadge>
//           </MDBListGroupItem>
//         </MDBListGroup>
//       </div>
//       <span className="mr-1">Patient Categories:</span>

//       {!categories.length ? (
//         <MDBBtn
//           size="sm"
//           rounded
//           color="primary"
//           onClick={() => setShowChoices((prev) => !prev)}
//         >
//           <MDBIcon icon="plus" />
//         </MDBBtn>
//       ) : (
//         <div
//           style={{ gap: "5px", display: "flex", flexWrap: "wrap" }}
//           onClick={() => setShowChoices((prev) => !prev)}
//         >
//           {categories.map((pk, i) => {
//             const { name } = Categories[pk];
//             return <MDBBadge key={i}>{name}</MDBBadge>;
//           })}
//         </div>
//         // <MDBBadge
//         //   color="info"
//         //   onClick={() => setShowChoices((prev) => !prev)}
//         //   style={{
//         //     maxWidth: "40rem", // adjust width as needed
//         //     whiteSpace: "normal", // allows wrapping
//         //     wordBreak: "break-word", // breaks long words if needed
//         //     lineHeight: "1.4", // better spacing
//         //     cursor: "pointer", // optional: indicates clickable
//         //   }}
//         // >
//         //   {categories
//         //     .map((c, i) => `${i + 1}. ${Categories[c].abbr}      `)
//         //     .join(" ")}
//         // </MDBBadge>
//       )}
//       {showChoices && (
//         <div
//           className="overflow-auto rounded border bg-white shadow-sm position-absolute "
//           style={{ zIndex: 9999 }}
//         >
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
//             }}
//           >
//             {Categories.map((cat, index) => {
//               const isSelect = categories.includes(index);
//               return (
//                 <div
//                   key={cat.abbr}
//                   className="d-flex align-items-center px-2 py-2"
//                 >
//                   <input
//                     id={`category-${index}`}
//                     type="checkbox"
//                     className="form-check-input me-2"
//                     checked={isSelect}
//                     onChange={() => {
//                       const _categories = [...categories];
//                       const removeIndex = _categories.indexOf(index);
//                       if (removeIndex > -1) {
//                         _categories.splice(removeIndex, 1);
//                       } else {
//                         _categories.push(index);
//                       }
//                       setCategories(_categories);
//                     }}
//                   />
//                   <label
//                     htmlFor={`category-${index}`}
//                     className="form-check-label"
//                   >
//                     {cat.name}
//                   </label>
//                 </div>
//               );
//             })}
//           </div>
//           <hr className="mt-n1" />
//           <div className="text-right mt-n2 mb-2">
//             <MDBBtnGroup size="sm">
//               <MDBBtn
//                 color="white"
//                 disabled={formSubmitted}
//                 onClick={() => {
//                   setShowChoices(false);
//                   setCategories(branch?.pc || []);
//                 }}
//               >
//                 Close
//               </MDBBtn>
//               <MDBBtn
//                 color="primary"
//                 onClick={handleUpdate}
//                 disabled={formSubmitted}
//               >
//                 Update <Spinner formSubmitted={formSubmitted} />
//               </MDBBtn>
//             </MDBBtnGroup>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientCategories;
