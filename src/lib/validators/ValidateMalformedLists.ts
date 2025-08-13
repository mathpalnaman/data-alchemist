import { Worker, ValidationError } from '@/types';

export function validateMalformedLists(workers: Worker[]): ValidationError[] {
  const errors: ValidationError[] = [];

  workers.forEach((worker, index) => {
    // Checking if AvailableSlots is a string before trying to split
    if (worker.AvailableSlots && typeof worker.AvailableSlots === 'string') {
      const slots = worker.AvailableSlots.split(',');
      for (const slot of slots) {
        // isNaN checks if a string is "Not-a-Number"
        if (isNaN(Number(slot.trim()))) {
          errors.push({
            entityType: 'workers', rowIndex: index, field: 'AvailableSlots',
            message: `List contains a non-numeric value: '${slot}'.`
          });
          // We only need to report one error per row, so we simply break
          break; 
        }
      }
    }
  });
  
  return errors;
}