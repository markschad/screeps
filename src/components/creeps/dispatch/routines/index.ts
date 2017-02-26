import * as _gatherUntilFull from "./gatherUntilFull";
import * as _storeEnergy from "./storeEnergy";
import * as _withdrawEnergy from "./withdrawEnergy";
import * as _construct from "./construct";
import * as _upgradeController from "./upgradeController";

/**
 * Creates a dictionary of all available routines.
 */
export const routines: { [name: string]: {} } = {

  construct: _construct,

  gatherUntilFull: _gatherUntilFull,

  storeEnergy: _storeEnergy,

  upgradeController: _upgradeController,

  withdrawEnergy: _withdrawEnergy,


};
