import { log } from "../../support/log";

import {
  getRoutineMemory,
} from "../routineMemory";

import {
  RoutineState,
} from "../routineState";

import * as pathing from "../../common/pathing";
import * as energyHelper from "../../common/energyHelper";

/**
 * Represents the routine cache when this routine is active.
 */
interface StoreEnergyOptions {
  targetStructureId: string;
}

/**
 * Sets up the routine for the given creep.
 * @param creep The creep for which to setup this routine.
 */
export const setup = (creep: Creep): void => {
  let routineMemory = getRoutineMemory(creep);
  let plan = routineMemory.plan;
  if (plan) {
    let options = plan.options as StoreEnergyOptions;
    // Default to an energy resource.
    if (options.targetStructureId) {
      let targetStructure = Game.getObjectById<Structure>(options.targetStructureId);
      if (targetStructure) {
        pathing.setPathTarget(creep, targetStructure.pos);
      } else {
        log.error("routine:storeEnergy has an invalid targetStructure.");
      }
    } else {
      log.error("routine:storeEnergy requires options 'targetStructureId'.");
    }
  }
};

/**
 * Runs the routine for this creep.
 * @param creep The creep for which to run this routine.
 */
export const run = (creep: Creep): void => {

  let routineMemory = getRoutineMemory(creep);

  let plan = routineMemory.plan;
  if (plan) {
    let options = plan.options as StoreEnergyOptions;
    let targetStructure = Game.getObjectById<Structure>(options.targetStructureId);
    if (targetStructure) {

      let tryHarvest = creep.transfer(targetStructure, RESOURCE_ENERGY);
      switch (tryHarvest) {
        // We have succesfully issued the harvest command.
        case OK:
          // Do nothing.
          break;

        // We are not close enough.
        case ERR_NOT_IN_RANGE:
          routineMemory.state = RoutineState.Done;
          pathing.executePath(creep);
          break;

        // We have no energy.
        case ERR_NOT_ENOUGH_ENERGY:
        case ERR_NOT_ENOUGH_RESOURCES:
          routineMemory.state = RoutineState.CannotWork;
          return;

        // Unhandled error.
        default:
          log.error(
            "routine:harvestEnergy:run creep:" +
            creep.name +
            " unhandled error. (" +
            tryHarvest + ")");

      }

      let isFull = energyHelper.getEnergy(targetStructure) ===
        energyHelper.getEnergyCapacity(targetStructure);

      if (isFull) {
        routineMemory.state = RoutineState.Done;
        return;
      } else if (creep.carry[RESOURCE_ENERGY] === 0) {
        routineMemory.state = RoutineState.CannotWork;
        return;
      }

    }
  }
};

export const teardown = (creep: Creep): void => {
  // Do Nothing.
  log.debug("routine:gatherResource:teardown creep:" + creep.name);
};
