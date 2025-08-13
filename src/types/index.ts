export interface Client {
  ClientID: string; // Unique id
  ClientName: string; // Name of the client
  PriorityLevel: number; // 1-5 scale
  RequestedTaskID: string; // ID of the task requested
  GroupTag: string; // Tag for grouping clients
  AttributesJSON: string; // JSON string of additional attributes
}
export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string; // Comma-separated list of skills
  AvailableSlots: string; // Comma-separated list of available time slots
  MaxLoadPerPhase: number; // Max tasks per phase
  WorkerGroup: string; // Group the worker belongs to
  QualificationLevel: number;
}
export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string; // Category of the task
  Duration: number; // Duration in hours
  RequiredSkills: string; // Comma-separated list of required skills
  PreferredPhases: string; // Comma-separated list of preferred phases
  MaxConcurrent: number; // Max concurrent tasks
}

export interface CoRunRule {
  type: 'coRun';
  tasks: string[]; // Task IDs that can run together
}

export interface LoadLimitRule {
  type: 'loadLimit';
  workerGroup: string;
  maxSlotsPerPhase: number;
}
 export type Rule = CoRunRule | LoadLimitRule;

 export interface Priorities {
  priorityLevelFulfillment: number;
  taskCompletion: number;
  fairDistribution: number;
 }

type DataMap = {
  clients: Client;
  workers: Worker;
  tasks: Task;
};

// used type map to ensure type safety across the application
export type ValidationError = {
  [K in keyof DataMap]: {
    entityType: K;
    rowIndex: number;
    field: keyof DataMap[K]; // This field must be a key of the related entity
    message: string;
    value?: DataMap[K][keyof DataMap[K]];
  };
}[keyof DataMap];