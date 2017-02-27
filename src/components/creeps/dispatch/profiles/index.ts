import * as _construct from "./construct";
import * as _fillEnergyStore from "./fillEnergyStore";
// import * as _upgradeController from "./upgradeController";
import * as _fillExtension from "./fillExtension";


export interface Profiler {
  run(room: Room): void;
}

export const profiles: { [name: string]: Profiler } = {

  construct: _construct,

  fillEnergyStore: _fillEnergyStore,

  fillExtension: _fillExtension,

  // upgradeCotnroller: _upgradeController,

};
