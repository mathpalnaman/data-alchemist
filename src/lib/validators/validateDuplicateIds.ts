import { Client, Worker, Task, ValidationError } from '@/types';

type DataMap = {
    clients: Client;
    workers: Worker;
    tasks: Task;
};

type EntityType = keyof DataMap;

export function validateDuplicateIds<K extends EntityType>(
    data: DataMap[K][],
    idKey: keyof DataMap[K],
    entityType: K
): ValidationError[] {
    const errors: ValidationError[] = [];
    const seenIds = new Map<string, number>();

    data.forEach((item, index) => {
        const id = item[idKey];
        if (!id || typeof id !== 'string') return;
        if (seenIds.has(id)) {
            const newError = {
                entityType,
                rowIndex: index,
                field: idKey,
                message: `Duplicate ID found: '${id}'. This ID is already used in row ${seenIds.get(id)! + 1}.`,
                value: id
            };
            errors.push(newError as ValidationError); // Ensure the error conforms to ValidationError type
        } else {
            seenIds.set(id, index);
        }
    });
    return errors;
}