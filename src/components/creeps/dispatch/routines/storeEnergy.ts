import { log } from "../../../support/log";
import {
  RoutineState,
  getRoutineMemory,
} from "../routine";
import * as memoryHelper from "../../../common/memoryHelper";
import * as energyHelper from "../../../common/energy";

import * as pathing from "../../pathing";

/**
 * Represents the portion of memory dedicated to the gatherUntilFullRoutine.
 */
export interface StoreEnergyRoutineOptions {
  nearestTo?: memoryHelper.RoomPositionMemory;
  energyStoreId?: string;
}

/**
 * Initialises this routine.
 */
export const start = (creep: Creep) => {

  let routineMemory = getRoutineMemory(creep);
  let routine = routineMemory.routine;

  if (routine) {
    let options = routine.options as StoreEnergyRoutineOptions;

    let energyStoreId = options.energyStoreId;
    let energyStore = Game.getObjectById(energyStoreId) as energyHelper.EnergyStore;

    if (!energyStore) {
      // Find the nearest energy store to the option "nearestTo" or this
      // creeps position.
      let nearestTo: RoomPosition =
        memoryHelper.toRoomPosition(options.nearestTo) ||
        creep.pos;
      energyStore = energyHelper.findNearestFillableEnergyStore(nearestTo) as energyHelper.EnergyStore;
      energyStoreId = energyStore.id;
    }

    // Set the creep path.
    pathing.setPathTarget(creep, energyStore.pos);

    // Store the energy source id so we don't have to calculate it again.
    routineMemory.cache.energyStoreId = energyStoreId;

  }

};

/**
 * Main logic for the gather until full routine.
 */
export const execute = (creep: Creep): RoutineState => {

  let routineMemory = getRoutineMemory(creep);

  // Get the memory source from memory.
  let energyStoreId = routineMemory.cache.energyStoreId;
  let store = Game.getObjectById(energyStoreId) as energyHelper.EnergyStore;

  // Attempt to store the energy.
  let tryStore = creep.transfer(store, RESOURCE_ENERGY);

  // Handle errors.
  switch (tryStore) {

    // Move towards the energy store if we are out-of-range.
    case ERR_NOT_IN_RANGE:
      pathing.executePath(creep);
      break;

    // Complete the routine if we are empty.
    case ERR_NOT_ENOUGH_RESOURCES:
      return routineMemory.state = RoutineState.Done;

    case OK:
      // Press on.
      break;

    default:
      log.debug(creep.name + ":storeEnergy - Unhandled error: " + tryStore);
      break;
  }

  if (creep.carry[RESOURCE_ENERGY] === 0 || store.energy === store.energyCapacity) {
    return RoutineState.Done;
  }

  return RoutineState.Working;

};
