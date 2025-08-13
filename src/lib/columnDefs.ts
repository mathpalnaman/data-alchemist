import { ColDef } from 'ag-grid-community'; // Importing ColDef for type safety in column definitions
import { Client, Worker, Task } from '@/types';

export const clientColumnDefs: ColDef<Client>[] = [
  { field: 'ClientID', headerName: 'Client ID' },
  { field: 'ClientName' },
  { field: 'PriorityLevel', valueParser: params => Number(params.newValue) }, // Ensure numbers are parsed correctly
  { field: 'RequestedTaskID' },
  { field: 'GroupTag' },
  { field: 'AttributesJSON', flex: 1 },
];

export const workerColumnDefs: ColDef<Worker>[] = [
  { field: 'WorkerID' },
  { field: 'WorkerName' },
  { field: 'Skills' },
  { field: 'AvailableSlots' },
  { field: 'MaxLoadPerPhase', valueParser: params => Number(params.newValue) },
  { field: 'WorkerGroup' },
  { field: 'QualificationLevel', valueParser: params => Number(params.newValue), flex: 1 },
];

export const taskColumnDefs: ColDef<Task>[] = [
  { field: 'TaskID' },
  { field: 'TaskName' },
  { field: 'Category' },
  { field: 'Duration', valueParser: params => Number(params.newValue) },
  { field: 'RequiredSkills' },
  { field: 'PreferredPhases' },
  { field: 'MaxConcurrent', valueParser: params => Number(params.newValue), flex: 1 }, // Ensure numbers are parsed correctly
];