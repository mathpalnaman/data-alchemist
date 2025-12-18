import { ColumnDef } from "@tanstack/react-table";
import { Client, Worker, Task } from "@/types";

// NOTE: We use 'accessorKey' which matches your data keys exactly.

export const clientColumnDefs: ColumnDef<Client>[] = [
  { accessorKey: "ClientID", header: "Client ID" },
  { accessorKey: "ClientName", header: "Client Name" },
  { accessorKey: "PriorityLevel", header: "Priority" },
  { accessorKey: "RequestedTaskID", header: "Task ID" },
  { accessorKey: "GroupTag", header: "Group" },
  { accessorKey: "AttributesJSON", header: "Attributes" },
];

export const workerColumnDefs: ColumnDef<Worker>[] = [
  { accessorKey: "WorkerID", header: "Worker ID" },
  { accessorKey: "WorkerName", header: "Name" },
  { accessorKey: "Skills", header: "Skills" },
  { accessorKey: "AvailableSlots", header: "Slots" },
  { accessorKey: "MaxLoadPerPhase", header: "Max Load" },
  { accessorKey: "WorkerGroup", header: "Group" },
  { accessorKey: "QualificationLevel", header: "Qual. Level" },
];

export const taskColumnDefs: ColumnDef<Task>[] = [
  { accessorKey: "TaskID", header: "Task ID" },
  { accessorKey: "TaskName", header: "Task Name" },
  { accessorKey: "Category", header: "Category" },
  { accessorKey: "Duration", header: "Duration" },
  { accessorKey: "RequiredSkills", header: "Req. Skills" },
  { accessorKey: "PreferredPhases", header: "Phases" },
  { accessorKey: "MaxConcurrent", header: "Max Conc." },
];