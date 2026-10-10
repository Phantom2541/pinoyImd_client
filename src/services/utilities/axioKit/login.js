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
    // POST: credentials in a body, not in a URL that gets logged.
    .post("assets/persons/auth/login", { email, password })
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
      // The little that "Welcome back" needs after a Log out.
      localStorage.setItem(
        "rememberedAccount",
        JSON.stringify({
          email: auth.email,
          pid: auth.pid,
          isMale: auth.isMale,
        }),
      );
      localStorage.removeItem("activePlatform");
      localStorage.setItem("companyId", JSON.stringify(companyId));

      return data;
    })
    .catch((error) => {
      const { response } = error || {};
      const { error: errorLabel, message } = response?.data || {};
      throw new Error(
        message ? `${errorLabel}: ${message}` : errorLabel || error.message,
      );
    });

export default login;
