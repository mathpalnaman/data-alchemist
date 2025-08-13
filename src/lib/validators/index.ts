import { Client, Worker, Task, ValidationError } from '@/types';
import { validateDuplicateIds } from './validateDuplicateIds';
import { validateOutOfRange } from './validateOutOfRange';
import { validateBrokenJson } from './validateBrokenJson';
import { validateMalformedLists } from './ValidateMalformedLists';
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
    validateDuplicateIds(data.tasks, 'TaskID', 'tasks'),
    validateOutOfRange(data.clients, data.tasks),
    validateBrokenJson(data.clients),
    validateMalformedLists(data.workers)
  );

  // other validation functions would be added here if i had more time

  return allErrors;
}