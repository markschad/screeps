
/**
 * A representation of a room position that can be stored in memory.
 */
export interface RoomPositionMemory {
  x: number;
  y: number;
  room: string;
}

/**
 * Returns a room position memory object from a room position.
 *
 */
export const toRoomPositionMemory = (pos: RoomPosition): RoomPositionMemory => {
  return {
    x: pos.x,
    y: pos.y,
    room: pos.roomName
  }
}

/**
 * Returns a room position from a room position memory object.
 */
export const toRoomPosition = (posMem: RoomPositionMemory | undefined): RoomPosition | undefined => {
  if (posMem === undefined) {
    return undefined;
  }
  return RoomPosition(posMem.x, posMem.y, posMem.room);
}
