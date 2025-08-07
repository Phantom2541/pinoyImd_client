const DocumentViewer = ({ src, height, width = "100%" }) => {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${src}&embedded=true`}
      title="PDF Viewer"
      width={width}
      height={height}
    />
  );
};

export default DocumentViewer;
