import { log } from "../../../support/log";
import {
  RoutineState,
  getRoutineMemory
} from "../routine";
import * as memoryHelper from "../../../common/memoryHelper";


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

  let routineMemory = getRoutineMemory(creep);
  let currentRoutineMemory = routineMemory.routines[0];
  let options = currentRoutineMemory.options as GatherUntilFullRoutineOptions;

  let energySourceId = options.energySourceId;

  if (!energySourceId) {
    // Find the nearest energy source to the option "nearestTo" or this
    // creeps position.
    let nearestTo: RoomPosition =
      memoryHelper.toRoomPosition(options.nearestTo) ||
      creep.pos;
    let energySource = nearestTo.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    energySourceId = energySource.id;
  }

  // Store the energy source id so we don't have to calculate it again.
  routineMemory.cache.energySourceId = energySourceId;

}


/**
 * Main logic for the gather until full routine.
 */
export const execute = (creep: Creep) => {

    let routineMemory = getRoutineMemory(creep);

    // Get the memory source from memory.
    let source = Game.getObjectById(routineMemory.cache.energySourceId) as Source;

    // Attempt to harvest the source.
    let tryHarvest = creep.harvest(source);

    // Handle errors.
    switch (tryHarvest) {

      // Move towards the source if we are out-of-range.
      case ERR_NOT_IN_RANGE:
        creep.moveTo(source);
        break;

      // Complete the routine if we are full.
      case ERR_FULL:
        routineMemory.state = RoutineState.Done;
        break;

      default:
        log.info(creep.name + ":gatherUntilFull - Unhandled error: " + tryHarvest);
        break;

    }
  }


};
