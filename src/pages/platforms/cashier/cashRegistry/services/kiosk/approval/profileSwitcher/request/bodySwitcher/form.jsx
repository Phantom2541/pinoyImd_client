import { useSelector } from "react-redux";
import { ImageMagnifier } from "../../../../../../../../../../components/images";
import { Cloudinary } from "../../../../../../../../../../services/utilities";

const Form = () => {
  const { selected } = useSelector(({ kiosk }) => kiosk);
  const { pid: customer = {}, schedule, requirements } = selected;
  return (
    <div className="shadow-sm">
      <ImageMagnifier
        src={`${Cloudinary.getEndpoint()}/${requirements?.rfId || ""}/users/${
          customer?.email
        }/booking/form-${schedule}.png`}
      />
    </div>
  );
};

export default Form;
