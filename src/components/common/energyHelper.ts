/**
 * An entity which holds energy.
 *
 * @export
 */
export interface EnergyStore extends Structure {
  store: { [resource: string]: number };
  storeCapacity: number;
};

export interface EnergyUser extends Structure {
  energy: number;
  energyCapacity: number;
}

/**
 * Returns true if the given structure is an energy store.
 */
export const isEnergyStore = (structure: Structure) => {
  return structure.structureType === STRUCTURE_CONTAINER ||
    structure.structureType === STRUCTURE_STORAGE;
};

/**
 * Returns true if the given structure is an energy store with energy.
 */
export const isEnergyStoreWithEnergy = (structure: Structure) => {
  if (isEnergyStore(structure)) {
    let energyStore = structure as EnergyStore;
    return energyStore.store[RESOURCE_ENERGY] > 50;
  }
  return false;
};

/**
 * Returns true if the given structure is an energy store with available storage.
 */
export const isFillableEnergyStore = (structure: Structure) => {
  if (isEnergyStore(structure)) {
    let energyStore = structure as EnergyStore;
    return _.sum(energyStore.store) < energyStore.storeCapacity;
  }
  return false;
};

/**
 * Returns true if the given structure is an energy user.
 */
export const isEnergyUser = (structure: Structure) => {
  return structure.structureType === STRUCTURE_SPAWN ||
    structure.structureType === STRUCTURE_EXTENSION;
};
