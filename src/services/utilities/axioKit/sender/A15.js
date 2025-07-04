import axios from "axios";

/**
 * Sends patient data to local Node middleware to overwrite the .txt file.
 *
 * @param {object} data - Patient information to send to Node (pn, patientName, test, result, unit, createdAt).
 * @returns {Promise<{ success: boolean, payload: object }>} - Result from middleware.
 */
const sendToA15 = async (data, token) => {
  await axios
    .post("http://localhost:5050/receive-task", data, {
      headers: {
        Authorization: `QTracy ${token}`,
      },
    })
    .then(({ data }) => ({ success: true, payload: data }))
    .catch((err) => {
      const message =
        err?.response?.data?.error || err.message || "Unknown error";
      throw new Error(`Middleware Error: ${message}`);
    });
};

export default sendToA15;
