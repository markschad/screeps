import * as _construct from "./construct";
import * as _fillEnergyStore from "./fillEnergyStore";
import * as _upgradeController from "./upgradeController";
import * as _fillExtension from "./fillExtension";
import * as _repair from "./repair";

/**
 * Represents a room profiler with a run method.
 */
export interface Profiler {
  run(room: Room): void;
  renew?(creep: Creep): void;
}

/**
 * A dictionary of all profilers.
 */
export const profiles: { [name: string]: Profiler } = {

  construct: _construct,

  fillEnergyStore: _fillEnergyStore,

  fillExtension: _fillExtension,

  repair:  _repair,

  upgradeController: _upgradeController,

};
