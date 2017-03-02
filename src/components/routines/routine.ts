/**
 * Represents a routine which can be run for a given creep.  Routines requrire setup and teardown
 * procedures to be defined, as well as the run procedure.
 */
export interface Routine {
  setup(creep: Creep): void;
  run(creep: Creep): void;
  teardown(creep: Creep): void;
};
