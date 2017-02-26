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
export interface ConstructRoutineOptions {
  nearestTo?: memoryHelper.RoomPositionMemory;
  constructionSiteId?: string;
}

/**
 * Initialises this routine.
 */
export const start = (creep: Creep) => {

  let routineMemory = getRoutineMemory(creep);
  let routine = routineMemory.routine;

  if (routine) {

    let options = routine.options as ConstructRoutineOptions;

    let constructionSiteId = options.constructionSiteId;
    let constructionSite = Game.getObjectById<ConstructionSite>(constructionSiteId);

    if (!constructionSite) {
      // Find the nearest constructionSite to build.
      let nearestTo: RoomPosition =
        memoryHelper.toRoomPosition(options.nearestTo) ||
        creep.pos;
      constructionSite = nearestTo.findClosestByPath<ConstructionSite>(FIND_CONSTRUCTION_SITES);
      // If there are no nearby construction sites, finish.
      if (!constructionSite) {
        routineMemory.state = RoutineState.Done;
        return;
      }

      constructionSiteId = constructionSite.id;
    }

    // Init pathing.
    pathing.setPathTarget(creep, constructionSite.pos);

    // Store the energy source id so we don't have to calculate it again.
    routineMemory.cache.constructionSiteId = constructionSite.id;

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
  let siteId = routineMemory.cache.constructionSiteId;
  let site = Game.getObjectById(siteId) as ConstructionSite;

  // If the site does not exist, consider it built.
  if (!site) {
    log.debug("no construction site.");
    return routineMemory.state = RoutineState.Done;
  }

  // Attempt to store the energy.
  let tryBuild = creep.build(site);

  // Handle errors.
  switch (tryBuild) {

    // Move towards the energy store if we are out-of-range.
    case ERR_NOT_IN_RANGE:
      // creep.moveTo(site);
      pathing.executePath(creep);
      break;

    // Set the routine into the cant work state if we do not have enough energy.
    case ERR_NOT_ENOUGH_ENERGY:
      return routineMemory.state = RoutineState.CantWork;

    default:
      log.info(creep.name + ":storeEnergy - Unhandled error: " + tryBuild);
      break;

  }

  return RoutineState.Working;

};
