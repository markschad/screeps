/**
 * Represents a plan for a routine.
 */
export interface RoutinePlan {
  name: string;
  options: {
    [name: string]: any;
  };
}

/**
 * Creates a routine plan for the routine with the given name and the given options.
 */
export const routinePlanFactory = (name: string, options: {} = {}): RoutinePlan => {
  return { name: name, options: options };
};
