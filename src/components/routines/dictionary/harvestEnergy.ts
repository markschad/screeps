import { log } from "../../support/log";

import {
  getRoutineMemory,
} from "../routineMemory";

import {
  RoutineState,
} from "../routineState";

import * as pathing from "../../common/pathing";

/**
 * Represents the routine cache when this routine is active.
 */
interface GatherResourceOptions {
  targetSourceId: string;
}

/**
 * Sets up the routine for the given creep.
 * @param creep The creep for which to setup this routine.
 */
export const setup = (creep: Creep): void => {
  let routineMemory = getRoutineMemory(creep);
  let plan = routineMemory.plan;
  if (plan) {
    let options = plan.options as GatherResourceOptions;
    // Default to an energy resource.
    if (options.targetSourceId) {
      let targetSource = Game.getObjectById<Source>(options.targetSourceId);
      if (targetSource) {
        pathing.setPathTarget(creep, targetSource.pos);
      } else {
        log.error("routine:harvestEnergy has an invalid targetSource.");
      }
    } else {
      log.error("routine:harvestEnergy requires options 'targetObjectId'.");
    }
  }
};

/**
 * Runs the routine for this creep.
 * @param creep The creep for which to run this routine.
 */
export const run = (creep: Creep): void => {

  let routineMemory = getRoutineMemory(creep);

  // If we are already at full energy, complete the routine.
  if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
    routineMemory.state = RoutineState.Done;
    return;
  }

  let plan = routineMemory.plan;
  if (plan) {
    let options = plan.options as GatherResourceOptions;
    let targetSource = Game.getObjectById<Source>(options.targetSourceId);
    if (targetSource) {

      let tryHarvest = creep.harvest(targetSource);
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
        // We are full.
        case ERR_FULL:
          break;
        // Unhandled error.
        default:
          log.error(
            "routine:harvestEnergy:run creep:" +
            creep.name +
            " unhandled error. (" +
            tryHarvest + ")");
      }

    }
  }

  // If we are now at full energy, complete the routine.
  if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
    routineMemory.state = RoutineState.Done;
  }

};


export const teardown = (creep: Creep): void => {
  // Do Nothing.
  log.debug("routine:gatherResource:teardown creep:" + creep.name);
};
