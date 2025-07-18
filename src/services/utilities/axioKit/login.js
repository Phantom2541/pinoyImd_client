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
      const companyId = localStorage.getItem("companyId");
      // localStorage.clear();
      const { token, auth } = data.payload;
      localStorage.setItem("token", token);
      localStorage.setItem("email", auth.email);
      localStorage.setItem("auth", JSON.stringify(auth));
      localStorage.setItem(
        "activePlatform",
        auth?.activePlatform?.platform || "patron"
      );
      localStorage.setItem("companyId", JSON.stringify(companyId));

      return data;
    })
    .catch(({ response }) => {
      const { error, message } = response.data;
      throw new Error(message ? `${error}: ${message}` : error);
    });

export default login;
