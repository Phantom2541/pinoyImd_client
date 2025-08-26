import axios from "axios";

/**
 * Sends patient data to local Node middleware to overwrite the .txt file.
 *
 * @param {object} data - Patient information to send to Node (pn, patientName, test, result, unit, createdAt).
 * @returns {Promise<{ success: boolean, payload: object }>} - Result from middleware.
 */

const sendToA15 = async (data, domain) => {
  try {
    // Gumawa ng local axios instance na walang baseURL
    const instance = axios.create();

    const url = domain.endsWith("/")
      ? `${domain}receive-task`
      : `${domain}/receive-task`;

    const response = await instance.post(url, data, {
      headers: {
        Authorization: "QTracy",
        "Content-Type": "application/json",
      },
    });

    return { success: true, payload: response.data };
  } catch (err) {
    const message =
      err?.response?.data?.error || err.message || "Unknown error";
    throw new Error(`Middleware Error: ${message}`);
  }
};

export default sendToA15;

// const sendToA15 = async (data, domain) => {
//   await axios
//     .post(`${domain}/receive-task`, data, {
//       headers: {
//         Authorization: `QTracy`,
//       },
//     })
//     .then(({ data }) => ({ success: true, payload: data }))
//     .catch((err) => {
//       const message =
//         err?.response?.data?.error || err.message || "Unknown error";
//       throw new Error(`Middleware Error: ${message}`);
//     });
// };

// export default sendToA15;
