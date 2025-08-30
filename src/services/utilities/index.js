import io from "socket.io-client";
import axioKit from "./axioKit";
import axiosMiddleware from "./axioKit/sender";
import Banner from "./banner";
import handlePagination from "./pagination";
import fullName from "./fullName";
import calculateDiff from "./calculateDiff";
import FailedBanner from "../../assets/failedBanner.jpg";
import FailedLogo from "../../assets/iMD.png";
import PresetUser from "../../assets/default.jpg";
import isJpegOrJpgFile from "./isJpegOrJpgFile";
import { fullAddress, billingAddress, LatitudeAddress } from "./fullAddress";
import bulkPayload from "./bulkPayload";
import globalSearch from "./globalSearch";
import taskBadge from "./taskBadge";
import capitalize from "./capitalize";
import mobile from "./mobile";
import contacts from "./contacts";
import getAge from "./getAge";
import getDate from "./getDate";
import getDepartment from "./getDepartment";
import currency from "./currency";
import removeRedundantPackages from "./removeRedundantPackages";
import { computeGD, allServicesHavePrices } from "./computeGD";
import validateContact from "./validateContact";
import generateEmail from "./generateEmail";
import { getGenderIcon, getPhysicianGenderIcon } from "./getGenderIcon";
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
import { dateFormat, timeFormat } from "./dateFormat";
import getTime from "./getTime";
import getDay from "./getDay";
import getBday from "./getBday";
import getWeekend from "./getWeekend";
import isClosingTime from "./isClosingTime";
import generateClaimStub from "./generateClaimStub";
import nickname from "./nickname";
import paymentBadge from "./paymentBadge";
import removeUndefinedValues from "./dataCleaner";
import collapse from "./collapse";
import Male from "../../assets/male.jpg";
import Female from "../../assets/female.jpg";
import Logo from "../../assets/iMD.png";
import PresetIMD from "../../assets/iMD.png";
import paymentMethod from "./paymentMethod";
import Deals from "./deals";
import Barcode from "./barcode";
import Cloudinary from "./cloudinary";
//Google Drive
import gDrive from "./gDrive";
// Clear's Cache
import clearSiteData from "./clearSiteData";
//EXCEL
import EMR_RESULT_TO_PDF from "./export/pdf/emr";
import VouchersToExcel from "./export/excel/vouchers";
import MenusToExcel from "./export/excel/menus";
import ResecoToExcel from "./export/excel/reseco";
import DealsToExcel from "./export/excel/deals";
//PDF
import MenusToPDF from "./export/pdf/menus";
//status
import employment from "../fakeDb/employment";

//fetch tracker
//this is Daily Tracker
import fetchTracker from "./fetchTracker";
//this is for once tracker fetching
import Tracker from "./tracker";

const ENDPOINT = "http://localhost:5000";
// const ENDPOINT = window.location.origin;

//
// endpoint ni kuya kevin
// const ENDPOINT = "https://pinoy-imd-deed6e69cc41.herokuapp.com";

//old socket set up
// const socket = io.connect(ENDPOINT);
const socket = io(ENDPOINT, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
});
const PresetImage = (gender) => (gender ? Male : Female);

export {
  paymentBadge,
  generateClaimStub,
  nickname,
  collapse,
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
  Cloudinary,
  axioKit,
  axiosMiddleware,
  socket,
  paymentMethod,
  Deals,
  handlePagination,
  getBday,
  fullName,
  calculateDiff,
  isJpegOrJpgFile,
  bulkPayload,
  globalSearch,
  taskBadge,
  capitalize,
  mobile,
  getAge,
  getDate,
  getTime,
  getDay,
  getDepartment,
  contacts,
  dateFormat,
  timeFormat,
  getWeekend,
  currency,
  removeRedundantPackages,
  computeGD,
  allServicesHavePrices,
  validateContact,
  generateEmail,
  getGenderIcon,
  getPhysicianGenderIcon,
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
  removeUndefinedValues,
  PresetIMD,
  Barcode,
  //Google Drive
  gDrive,
  //status of employment
  employment,
  //address formatter,
  fullAddress,
  billingAddress,
  LatitudeAddress,
  // Cache's Clear
  clearSiteData,
  //export to excel
  DealsToExcel,
  VouchersToExcel,
  MenusToExcel,
  ResecoToExcel,
  //export to pdf
  MenusToPDF,
  EMR_RESULT_TO_PDF,
  //Logo
  Logo,
  fetchTracker,
  Tracker,
};
