export function findStorage(room: Room): Array<Structure> {

  let storage = room.find<Structure>(FIND_MY_STRUCTURES, {
    filter: {
      structureType: STRUCTURE_CONTAINER
    }
  });

  return storage;

};
