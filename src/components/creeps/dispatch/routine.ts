

export enum RoutineState {
  Starting,
  Working,
  Done
}

/**
 * Represents the portion of creep memory dedicated to the
 * current routines.
 */
export interface RoutineMemory {
  state: RoutineState;
  positions: { [name: string]: RoomPosition };
}
