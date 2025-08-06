import Patient from "./patient";
import Admission from "./admission";

const Body = ({ activeTab, data, onChange }) => {
  return (
    <div className="p-4">
      {activeTab === "patient" && <Patient data={data} onChange={onChange} />}
      {activeTab === "admission" && (
        <Admission data={data} onChange={onChange} />
      )}
    </div>
  );
};

export default Body;
