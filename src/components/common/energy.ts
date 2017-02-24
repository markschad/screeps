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
 * Retrieves the nearest energy store which is not full.
 *
 * @export
 */
export const findNearestFillableEnergyStore = (pos: RoomPosition): EnergyStore | undefined => {

  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: isEnergyStore
  }) as EnergyStore;

};



