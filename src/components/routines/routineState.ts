/**
 * Represents a routine state.
 */
export enum RoutineState {
  /**
   * The creep is working on the current routine.
   */
  Working,
  /**
   * The creep is unable to work on the current routine.
   */
  CannotWork,
  /**
   * The creep has finished working on the current routine.
   */
  Done
}
