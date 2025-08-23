import { useSelector } from "react-redux";
import SIGNATURE from "../../../../assets/templateSampleSignature.png";
import { Cloudinary, properFullname } from "../../../../services/utilities";
import utils from "./utils";
//41=Chief LMS //42 Pathologist
const Footer = () => {
  const { collections = [] } = useSelector(({ personnels }) => personnels);
  const [lms, admin, pathologist] = utils.getSignatories(collections);
  return (
    <div className="template-schedule-signatures">
      {[
        {
          name: properFullname(lms?.fullName),
          src: `${Cloudinary.getEndpoint()}/${lms?.sid || ""}/users/${
            lms?.email
          }/signature.png`,
          title: "Chief Medical Technologist",
        },
        {
          name: admin ? properFullname(admin?.fullName) : "",
          title: "Administrator",
        },
        {
          name: properFullname(pathologist?.fullName),
          title: "Pathologist",
          src: `${Cloudinary.getEndpoint()}/${pathologist?.sid || ""}/users/${
            pathologist?.email
          }/signature.png`,
        },
      ].map((person, idx) => {
        const hasPerson = person?.name ? true : false;
        return (
          <div key={idx} className="template-schedule-signature-container">
            <span className="template-schedule-signature-checked">
              Checked By:
            </span>

            <div className="template-schedule-signature-info">
              <img src={person.src} alt="signature" />
              <span style={{ color: hasPerson ? "black" : "red" }}>
                {hasPerson ? person?.name : `No ${person.title} found`}
              </span>
              <em className="text-center">{person.title}</em>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Footer;
