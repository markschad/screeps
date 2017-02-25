import { log } from "../../../support/log";
import {
  RoutineState,
  getRoutineMemory
} from "../routine";
import * as memoryHelper from "../../../common/memoryHelper";

import * as energyHelper from "../../../common/energy";

/**
 * Represents the portion of memory dedicated to the gatherUntilFullRoutine.
 */
export interface StoreEnergyRoutineOptions {
  nearestTo?: memoryHelper.RoomPositionMemory;
  energyStoreId?: string
}

/**
 * Initialises this routine.
 */
export const start = (creep: Creep) => {

  let routineMemory = getRoutineMemory(creep);
  let currentRoutineMemory = routineMemory.routines[0];
  let options = currentRoutineMemory.options as StoreEnergyRoutineOptions;

  let energyStoreId = options.energyStoreId;

  if (!energyStoreId) {
    // Find the nearest energy store to the option "nearestTo" or this
    // creeps position.
    let nearestTo: RoomPosition =
      memoryHelper.toRoomPosition(options.nearestTo) ||
      creep.pos;
    let energyStore = energyHelper.findNearestFillableEnergyStore(nearestTo) as energyHelper.EnergyStore;
    energyStoreId = energyStore.id;
  }

  // Store the energy source id so we don't have to calculate it again.
  routineMemory.cache.energyStoreId = energyStoreId;

}


/**
 * Main logic for the gather until full routine.
 */
export const execute = (creep: Creep) => {

    let routineMemory = getRoutineMemory(creep);

    // Get the memory source from memory.
    let store = Game.getObjectById(routineMemory.cache.energyStoreId) as energyHelper.EnergyStore;

    // Attempt to store the energy.
    let tryStore = creep.transfer(store, RESOURCE_ENERGY);

    // Handle errors.
    switch (tryStore) {

      // Move towards the energy store if we are out-of-range.
      case ERR_NOT_IN_RANGE:
        creep.moveTo(store);
        break;

      // Complete the routine if we are empty.
      case ERR_NOT_ENOUGH_RESOURCES:
        routineMemory.state = RoutineState.Done;
        break;

      default:
        log.info(creep.name + ":storeEnergy - Unhandled error: " + tryStore);
        break;

    }
  }


};
