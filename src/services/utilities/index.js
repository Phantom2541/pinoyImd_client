import io from "socket.io-client";
import axioKit from "./axioKit";
import Banner from "./banner";
import handlePagination from "./pagination";
import fullName from "./fullName";
import calculateDiff from "./calculateDiff";
import Male from "../../assets/male.jpg";
import Female from "../../assets/female.jpg";
import FailedBanner from "../../assets/failedBanner.jpg";
import FailedLogo from "../../assets/failedLogo.png";
import PresetUser from "../../assets/default.jpg";
import isJpegOrJpgFile from "./isJpegOrJpgFile";
import fullAddress from "./fullAddress";
import bulkPayload from "./bulkPayload";
import globalSearch from "./globalSearch";
import taskBadge from "./taskBadge";
import capitalize from "./capitalize";
import mobile from "./mobile";
import contacts from "./contacts";
import getAge from "./getAge";
import getDate from "./getDate";
import currency from "./currency";
import removeRedundantPackages from "./removeRedundantPackages";
import computeGD from "./computeGD";
import validateContact from "./validateContact";
import generateEmail from "./generateEmail";
import getGenderIcon from "./getGenderIcon";
import harvestTask from "./harvestTask";
import sourceColor from "./sourceColor";
import getDevelopment from "./getDevelopment";
import formColor from "./formColor";
import referenceColor from "./referenceColor";
import properFullname from "./properFullname";
import calculateIndicators from "./calculateIndicators";
import formatToSI from "./formatToSI";
import formatNameToObj from "./formatNameToObject";
import findReference from "./findReference";
import isImageValid from "./isImageValid";
import generateCode from "./generateCode";
import Search from "./search";
import generateCalendar from "./generateCalendar";
import fullNameSearch from "./fullNameSearch";
import dateFormat from "./dateFormat";
import getTime from "./getTime";
import getWeekend from "./getWeekend";
import isClosingTime from "./isClosingTime";
import generateClaimStub from "./generateClaimStub";
import nickname from "./nickname";
import paymentBadge from "./paymentBadge";

const ENDPOINT = "http://localhost:5000";
// const ENDPOINT = window.location.origin;

// endpoint ni kuya kevin
// const ENDPOINT = "https://pinoy-imd-deed6e69cc41.herokuapp.com";

const socket = io.connect(ENDPOINT);
const PresetImage = (gender) => (gender ? Male : Female);

export {
  paymentBadge,
  generateClaimStub,
  nickname,
  Banner,
  isClosingTime,
  fullNameSearch,
  generateCalendar,
  generateCode,
  isImageValid,
  FailedBanner,
  FailedLogo,
  PresetImage,
  ENDPOINT,
  axioKit,
  socket,
  handlePagination,
  fullName,
  calculateDiff,
  isJpegOrJpgFile,
  fullAddress,
  bulkPayload,
  globalSearch,
  taskBadge,
  capitalize,
  mobile,
  getAge,
  getDate,
  getTime,
  contacts,
  dateFormat,
  getWeekend,
  currency,
  removeRedundantPackages,
  computeGD,
  validateContact,
  generateEmail,
  getGenderIcon,
  harvestTask,
  sourceColor,
  getDevelopment,
  formColor,
  referenceColor,
  properFullname,
  calculateIndicators,
  formatToSI,
  findReference,
  Search,
  PresetUser,
  formatNameToObj,
};
