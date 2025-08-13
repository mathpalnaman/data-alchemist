import { Client, Task, ValidationError } from '@/types';

export function validateOutOfRange(clients: Client[], tasks: Task[]): ValidationError[] {
  const errors: ValidationError[] = [];

  clients.forEach((client, index) => {
    if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
      errors.push({
        entityType: 'clients', rowIndex: index, field: 'PriorityLevel',
        message: `PriorityLevel must be between 1 and 5, but got ${client.PriorityLevel}.`
      });
    }
  });

  tasks.forEach((task, index) => {
    if (task.Duration < 1) {
      errors.push({
        entityType: 'tasks', rowIndex: index, field: 'Duration',
        message: `Duration must be at least 1, but got ${task.Duration}.`
      });
    }
  });

  return errors;
}