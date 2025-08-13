import { Client, Worker, Task, ValidationError } from '@/types';
import { validateDuplicateIds } from './validateDuplicateIds';

interface AllData {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
}

export function validateAllData(data: AllData): ValidationError[] { // This function validates all data entities and returns an array of validation errors
  let allErrors: ValidationError[] = [];

  allErrors = allErrors.concat(
    validateDuplicateIds(data.clients, 'ClientID', 'clients'),
    validateDuplicateIds(data.workers, 'WorkerID', 'workers'),
    validateDuplicateIds(data.tasks, 'TaskID', 'tasks')
  );

  // Will chain other validator calls

  return allErrors;
}