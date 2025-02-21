import axios from "axios";

/**
 * Login function.
 *
 * @param {string} email - E-mail Address used for authentication.
 * @param {string} password - Password used for authentication.
 * @returns {{ success: boolean, payload: object }} - The result object containing success and payload.
 */
const login = async (email, password) =>
  await axios
    .get(`assets/persons/auth/login?email=${email}&password=${password}`)
    .then(({ data }) => {
      /**
       * Clear the local storage first
       */
      localStorage.clear();
      const { payload } = data;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("email", payload.auth.email);
      localStorage.setItem(
        "activePlatform",
        payload.auth?.activePlatform.platform
      );
      return data;
    })
    .catch(({ response }) => {
      const { error, message } = response.data;
      throw new Error(message ? `${error}: ${message}` : error);
    });

export default login;
