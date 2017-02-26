import * as _construct from "./construct";
import * as _fillEnergyStore from "./fillEnergyStore";
import * as _upgradeController from "./upgradeController";


export interface Profiler {
  run(room: Room): void;
}

export const profiles: { [name: string]: Profiler } = {

  construct: _construct as Profiler,

  fillEnergyStore: _fillEnergyStore as Profiler,

  upgradeCotnroller: _upgradeController as Profiler,

};
