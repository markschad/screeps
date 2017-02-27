import { log } from "../../../support/log";
import {
  RoutineState,
  getRoutineMemory
} from "../routine";
import * as memoryHelper from "../../../common/memoryHelper";
import * as energyHelper from "../../../common/energy";

import * as pathing from "../../pathing";

/**
 * Represents the portion of memory dedicated to the gatherUntilFullRoutine.
 */
export interface RetrieveEnergyRoutineOptions {
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
    let options = routine.options as RetrieveEnergyRoutineOptions;

    let energyStoreId = options.energyStoreId;
    let energyStore = Game.getObjectById(energyStoreId) as energyHelper.EnergyStore;

    if (!energyStore) {
      // Find the nearest energy store to the option "nearestTo" or this
      // creeps position.
      let nearestTo = memoryHelper.toRoomPosition(options.nearestTo) || creep.pos;
      energyStore = energyHelper.findNearestEnergyStoreWithEnergy(nearestTo, 50);
      if (!energyStore) {
        return;
      }
      energyStoreId = energyStore.id;
    }

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

  // If there's no available store, finish this task.
  if (!store) {
    return routineMemory.state = RoutineState.Done;
  }

  // If the store has no energy, finish the task.
  if (store.energy === 0) {
    return routineMemory.state = RoutineState.Done;
  }

  // Attempt to retrieve the energy.
  let tryWithdraw = creep.withdraw(store, RESOURCE_ENERGY);

  // Handle errors.
  switch (tryWithdraw) {

    // Move towards the energy store if we are out-of-range.
    case ERR_NOT_IN_RANGE:
      // creep.moveTo(store);
      pathing.executePath(creep);
      break;

    // Complete the routine if we are empty.
    case ERR_FULL:
      return routineMemory.state = RoutineState.Done;

    default:
      log.info(creep.name + ":storeEnergy - Unhandled error: " + tryWithdraw);
      break;

  }

  return RoutineState.Working;

};
