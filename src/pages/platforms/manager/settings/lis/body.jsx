import { useSelector } from "react-redux";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
// import {
//   DOWNLOAD_MIDDLEWARE,
//   SetEDIT,
// } from "../../../../../services/redux/slices/market/machines";
import { useEffect, useState } from "react";
import axios from "axios";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ machines }) => machines
    ),
    [loading, setLoading] = useState(false),
    [progress, setProgress] = useState(0);
  // dispatch = useDispatch();

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  console.log("loading", loading);
  const handleDownload = async () => {
    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.get(
        "http://localhost:5000/Procurements/commodity/download_middleware",
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "A15.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
    } catch (err) {
      console.error("Download failed", err);
      setProgress(0);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 1000);
    }
  };

  useEffect(() => {
    console.log("progress", progress);
  }, [progress]);

  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Section</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, model, brand, section = "" } = item;

          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>
              <td>
                <b>
                  <h6>{model}</h6>
                  <small className="mt-n1 d-block">{brand}</small>
                </b>
              </td>

              <td>{section}</td>

              <td>
                <MDBBtn size="sm" color="warning" onClick={handleDownload}>
                  <MDBIcon icon="download" className="mr-2" /> Download
                  Middleware
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
