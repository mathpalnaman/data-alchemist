import { Client, ValidationError } from '@/types';

export function validateBrokenJson(clients: Client[]): ValidationError[] {
  const errors: ValidationError[] = [];

  clients.forEach((client, index) => {
    // Only check if the field is not empty
    if (client.AttributesJSON) {
        try {
            JSON.parse(client.AttributesJSON);
        } catch {
            errors.push({
                entityType: 'clients', rowIndex: index, field: 'AttributesJSON',
                message: `The JSON string is malformed.`
            });
        }
    }
  });

  return errors;
}