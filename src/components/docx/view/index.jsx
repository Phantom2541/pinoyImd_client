import draftToHtml from "draftjs-to-html";
import "./style.css"

const DocxView = ({ content }) => {
  let html = "<p>No content</p>";

  try {
    html = draftToHtml(content); // content is in raw format
  } catch (err) {
    console.error("Invalid content format", err);
  }

  return (
    <div
      className="prose border p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default DocxView;
