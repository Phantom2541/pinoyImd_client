import axios from "axios";

/**
 * Login function.
 *
 * @param {Array<any>|object} data - Information that will be used for validation.
 * @param {string} token - Authorization Token.
 * @returns {{ success: boolean, payload: object }} - The result object containing success and payload.
 */
const changePassword = async (data, token) =>
  await axios
    .put("assets/persons/auth/changePassword", data, {
      headers: {
        Authorization: `QTracy ${token}`,
      },
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      const { error, message } = response.data;
      throw new Error(message ? `${error}: ${message}` : error);
    });

export default changePassword;
