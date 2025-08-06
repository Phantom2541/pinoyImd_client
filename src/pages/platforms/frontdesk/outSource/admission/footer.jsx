const Footer = ({ onSubmit }) => (
  <div className="mt-4 text-right">
    <button
      className="bg-green-600 text-white px-4 py-2 rounded"
      onClick={onSubmit}
    >
      Save & Continue to Case Details
    </button>
  </div>
);

export default Footer;
