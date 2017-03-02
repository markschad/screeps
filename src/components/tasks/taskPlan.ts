import { RoutinePlan } from "../routines/routinePlan";
import { TaskInteractions } from "./taskInteractions";
import { BodyConfig } from "../common/bodyConfig";

/**
 * Represents a plan to complete a task.
 */
export interface TaskPlan {
  /**
   * The unique id of this task.
   */
  id: number;
  /**
   * The name of the task.
   */
  name: string;
  /**
   * The name of the creep this task is assigned it.
   */
  assignedTo: string;
  /**
   * The index of the current routine plan.
   */
  planIndex: number;
  /**
   * The collection of all routine plans in this task.
   */
  plans: RoutinePlan[];
  /**
   * The priority of the task.  Higher numbers are queued to the front.
   */
  priority: number;
  /**
   * The collection of all interactions involved in this task.
   */
  interactions: TaskInteractions;
  /**
   * The prerequisites for assignment.
   */
  prereq: TaskPlanPrereq;
};

/**
 * Represents prerequisites for a creep to be able to be assigned to a task.
 */
export interface TaskPlanPrereq {
  body?: BodyConfig;
}
