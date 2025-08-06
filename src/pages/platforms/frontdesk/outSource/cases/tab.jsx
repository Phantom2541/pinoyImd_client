const Tab = ({ activeTab, setActiveTab }) => (
  <div className="border-b flex">
    <button
      className={`px-4 py-2 w-1/2 text-left ${
        activeTab === "patient" ? "bg-gray-100 font-semibold" : ""
      }`}
      onClick={() => setActiveTab("patient")}
    >
      Patient Info
    </button>
    <button
      className={`px-4 py-2 w-1/2 text-left ${
        activeTab === "admission" ? "bg-gray-100 font-semibold" : ""
      }`}
      onClick={() => setActiveTab("admission")}
    >
      Admission Info
    </button>
  </div>
);

export default Tab;
