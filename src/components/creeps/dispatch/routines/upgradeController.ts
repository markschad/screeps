// import { log } from "../../../support/log";
import {
  RoutineState,
  getRoutineMemory,
} from "../routine";
// import * as memoryHelper from "../../../common/memoryHelper";

import * as pathing from "../../pathing";

/**
 * Initialises this routine.
 */
export const start = (creep: Creep) => {

  let controller = creep.room.controller;

  if (controller) {
    pathing.setPathTarget(creep, controller.pos);
  }

};

/**
 * Main logic for the gather until full routine.
 */
export const execute = (creep: Creep): RoutineState => {

  let routineMemory = getRoutineMemory(creep);

  let controller = creep.room.controller;

  if (!controller) {
    return routineMemory.state = RoutineState.Done;
  } else {

    let tryUpgrade = creep.upgradeController(controller);

    switch (tryUpgrade) {

      case ERR_NOT_IN_RANGE:
        // creep.moveTo(controller);
        pathing.executePath(creep);
        break;

      // Finish when there is no more energy.
      case ERR_NOT_ENOUGH_RESOURCES:
        return routineMemory.state = RoutineState.Done;

      case OK:
      default:
        return routineMemory.state = RoutineState.Working;

    }

  }

  return RoutineState.Working;

};
