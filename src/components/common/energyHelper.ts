/**
 * An entity which holds energy.
 *
 * @export
 */
export interface EnergyStore extends Structure {
  store: { [resource: string]: number };
  storeCapacity: number;
};

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
 * Returns the current amount of energy in this structure or zero if the structure does not hold
 * energy.
 *
 * @param structure The structure for which to get the energy amount.
 */
export const getEnergy = (structure: Structure): number => {
  let s = structure as any;
  return s.energy || s.store[RESOURCE_ENERGY] || 0;
};

/**
 * Returns the energy capacity for the given structure or zero if the structure does not hold
 * energy.
 *
 * @param structure The structure for which to get the energy capacity.
 */
export const getEnergyCapacity = (structure: Structure) => {
  let s = structure as any;
  return s.energyCapacity || s.storeCapacity || 0;
};
