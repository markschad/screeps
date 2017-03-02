import { TaskPlan } from "./taskPlan";

/**
 * Represents an object which holds the business logic for a task.
 */
export interface Task {
  /**
   * Profiles the given room and returns an array of tasks which should be enqueued.
   */
  profile(room: Room): TaskPlan[];
  /**
   * Creates a new task plan for this task.
   */
  factory(room: Room, ... args: any[]): TaskPlan;
};
