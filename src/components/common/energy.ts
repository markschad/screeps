import { log } from "../support/log";

/**
 * An entity which holds energy.
 *
 * @export
 */
export interface EnergyStore extends Structure {
  energy: number;
  energyCapacity: number;
};

/**
 * Returns true if the given structure is an energy store.
 *
 * @export
 */
export const isEnergyStore = (structure: Structure) => {
  return structure.structureType === STRUCTURE_SPAWN ||
    structure.structureType === STRUCTURE_CONTAINER ||
    structure.structureType === STRUCTURE_EXTENSION;
};

/**
 * Returns true if the given structure is an energy store which is not at
 * capacity.
 *
 * @export
 */
export const isFillableEnergyStore = (structure: Structure) => {

  switch (structure.structureType) {
    case STRUCTURE_SPAWN:
    case STRUCTURE_EXTENSION:
      let energyStore = structure as EnergyStore;
      if (energyStore.energy < energyStore.energyCapacity) {
        return true;
      } else {
        return false;
      }

    case STRUCTURE_CONTAINER:

      let container = structure as StructureContainer;
      if (_.sum(container.store) < container.storeCapacity) {
        return true;
      } else {
        return false;
      }

    default:
      return false;
  }
};

/**
 * Returns true if the given structure is an energy store with atleast minEnergy.
 */
export const isEnergyStoreWithEnergyFactory = (minEnergy: number = 1): Function => {
  return (s: Structure) => {
    switch (s.structureType) {
    // case STRUCTURE_SPAWN:
    case STRUCTURE_EXTENSION:
      let energyStore = s as EnergyStore;
      if ((<OwnedStructure> s).my && energyStore.energy >= minEnergy) {
        return true;
      } else {
        return false;
      }

    case STRUCTURE_CONTAINER:
      let container = s as StructureContainer;
      if (container.store[RESOURCE_ENERGY] >= minEnergy) {
        return true;
      } else {
        return false;
      }

    default:
      return false;
  }
  }
}


/**
 * Retrieves the nearest energy store which is not full.
 *
 * @export
 */
export const findNearestFillableEnergyStore = (pos: RoomPosition): EnergyStore | undefined => {

  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: isFillableEnergyStore,
  }) as EnergyStore;

};

/**
 * Retrieves all energy stores in the given room which are not fill.
 *
 * @export
 */
export const findFillableEnergyStore = (room: Room): EnergyStore[] => {
  log.debug("Find fillable energy stores.");
  return room.find(FIND_STRUCTURES, { filter: isFillableEnergyStore }) as EnergyStore[];
};

/**
 * Retrieves the closest energy store to pos with atleast
 */
export const findNearestEnergyStoreWithEnergy =
  (pos: RoomPosition, minEnergy: number = 50): EnergyStore => {
  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: isEnergyStoreWithEnergyFactory(minEnergy),
  }) as EnergyStore;
};



