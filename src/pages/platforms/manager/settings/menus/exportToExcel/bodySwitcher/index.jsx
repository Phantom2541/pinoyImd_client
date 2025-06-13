import Inhouse from "./inhouse";
import Insource from "./insource";
import Wellness from "./wellness";

const components = {
  inhouse: Inhouse,
  hmo: Wellness,
  mbs: Insource,
  ctr: Insource,
};

const BodySwitcher = ({ form, setForm }) => {
  const Component = components[form?.menuType?.toLowerCase()];

  if (!Component) {
    return (
      <div className="text-muted">
        No compoenent available for this selection.
      </div>
    );
  }

  return <Component form={form} setForm={setForm} />;
};

export default BodySwitcher;
