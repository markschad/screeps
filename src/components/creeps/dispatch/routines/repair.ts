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
export interface RepairRoutineOptions {
  nearestTo?: memoryHelper.RoomPositionMemory;
  structureId?: string;
}

/**
 * Initialises this routine.
 */
export const start = (creep: Creep) => {

  let routineMemory = getRoutineMemory(creep);
  let routine = routineMemory.routine;

  if (routine) {

    let options = routine.options as RepairRoutineOptions;

    let structureId = options.structureId;
    let structure = Game.getObjectById<Structure>(structureId);

    if (!structure) {
      // Find the nearest structure to repair.
      let nearestTo: RoomPosition =
        memoryHelper.toRoomPosition(options.nearestTo) ||
        creep.pos;
      structure = nearestTo.findClosestByPath<Structure>(FIND_STRUCTURES, {
        filter: (s: Structure) => { return (s.hits / s.hitsMax) < 0.2; },  // 20%
      });
      // If there are no nearby construction sites, finish.
      if (!structure) {
        routineMemory.state = RoutineState.Done;
        return;
      }

      structureId = structure.id;
    }

    // Init pathing.
    pathing.setPathTarget(creep, structure.pos);

    // Store the energy source id so we don't have to calculate it again.
    routineMemory.cache.constructionSiteId = structure.id;

  } else {
    log.debug("No routine.");
  }

};


/**
 * Main logic for the gather until full routine.
 */
export const execute = (creep: Creep): RoutineState => {

  let routineMemory = getRoutineMemory(creep);
  if (!creep.carry[RESOURCE_ENERGY]) {
    return routineMemory.state = RoutineState.CantWork;
  }

  // Get the memory source from memory.
  let structureId = routineMemory.cache.constructionSiteId;
  let structure = Game.getObjectById(structureId) as Structure;

  // If the site does not exist, consider it built.
  if (!structure || structure.hits === structure.hitsMax) {
    return routineMemory.state = RoutineState.Done;
  }

  // Attempt to repair the structure.
  let tryRepair = creep.repair(structure);

  // Handle errors.
  switch (tryRepair) {

    // Move towards the energy store if we are out-of-range.
    case ERR_NOT_IN_RANGE:
      // creep.moveTo(site);
      pathing.executePath(creep);
      break;

    // Set the routine into the cant work state if we do not have enough energy.
    case ERR_NOT_ENOUGH_RESOURCES:
      return routineMemory.state = RoutineState.CantWork;

    default:
      log.info(creep.name + ":repair - Unhandled error: " + tryRepair);
      break;

  }

  return RoutineState.Working;

};
