import { log } from "../../../support/log";
import {
  RoutineState,
  getRoutineMemory
} from "../routine";
import * as memoryHelper from "../../../common/memoryHelper";

import * as pathing from "../../pathing";

/**
 * Represents the portion of memory dedicated to the gatherUntilFullRoutine.
 */
export interface GatherUntilFullRoutineOptions {
  nearestTo?: memoryHelper.RoomPositionMemory;
  energySourceId: string;
}

/**
 * Initialises this routine.
 */
export const start = (creep: Creep) => {

  log.debug("starting routine gatherUntilFull");

  let routineMemory = getRoutineMemory(creep);
  let routine = routineMemory.routine;

  if (routine) {

    let options = routine.options as GatherUntilFullRoutineOptions;
    let energySourceId = options.energySourceId;
    let energySource = Game.getObjectById<Source>(energySourceId);

    log.debug("options.nearestTo: " + options.nearestTo);

    if (!energySource) {
      // Find the nearest energy source to the option "nearestTo" or this
      // creeps position.
      let nearestTo: RoomPosition =
        memoryHelper.toRoomPosition(options.nearestTo) ||
        creep.pos;
      energySource = nearestTo.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
      energySourceId = energySource.id;
    }

    pathing.setPathTarget(creep, energySource.pos);

    // Store the energy source id so we don't have to calculate it again.
    routineMemory.cache.energySourceId = energySourceId;

    log.debug("cached energySourceId " + energySourceId);

  }


};


/**
 * Main logic for the gather until full routine.
 */
export const execute = (creep: Creep): RoutineState => {

  log.debug("Executing routine gatherUntilFull for creep " + creep.name);

  let routineMemory = getRoutineMemory(creep);

  // Get the memory source from memory.
  let source = Game.getObjectById(routineMemory.cache.energySourceId) as Source;

  log.debug("energySourceId " + routineMemory.cache.energySourceId);

  // Attempt to harvest the source.
  let tryHarvest = creep.harvest(source);

  // Handle errors.
  switch (tryHarvest) {

    // Move towards the source if we are out-of-range.
    case ERR_NOT_IN_RANGE:
      // creep.moveTo(source);
      pathing.executePath(creep);
      break;

    // Complete the routine if we are full.
    case ERR_FULL:
      log.debug("gatherUntilFull done");
      return routineMemory.state = RoutineState.Done;

    // Keep gathering.
    case OK:
      break;

    default:
      log.debug(creep.name + ":gatherUntilFull - Unhandled error: " + tryHarvest);
      break;
  }

  // If we're full, finish the routine.
  if (_.sum(creep.carry) === creep.carryCapacity) {
    log.debug("gatherUntilFull done");
    return routineMemory.state = RoutineState.Done;
  }

  return RoutineState.Working;

};
