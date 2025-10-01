import { DiastolicFields as Diastolic } from "./diastolics";
import { MModeFields as Mmode } from "./mmodes";
import { ParameterFields as Paramets } from "./paramets";
import { VolumeFields as Volumes } from "./volumes";
import { FlowDopplerFields as FlowDoppler } from "./flowDoppler";
import { ExtraValuesFields as ExtraValue } from "./extraVal";
import Regurgitation from "./regurgitation";
import TissueDoppler from "./tissueDoppler";
import Others from "./others";

const Echo = {
  Diastolic,
  Mmode,
  Paramets,
  Volumes,
  FlowDoppler,
  ExtraValue,
  Regurgitation,
  TissueDoppler,
  Others,
};

export default Echo;
