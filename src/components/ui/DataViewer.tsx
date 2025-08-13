"use client";
import { useDataStore } from '@/store/useDataStore';
import { clientColumnDefs, workerColumnDefs, taskColumnDefs } from '@/lib/columnDefs';
import { DataDialog } from './DataDialog';

export function DataViewer() {
  const { clients, workers, tasks } = useDataStore();

  return (
    <div className="flex flex-wrap gap-4">
      <DataDialog
        entityType="clients"
        title="Clients"
        data={clients}
        columnDefs={clientColumnDefs}
      />
      <DataDialog
        entityType="workers"
        title="Workers"
        data={workers}
        columnDefs={workerColumnDefs}
      />
      <DataDialog
        entityType="tasks"
        title="Tasks"
        data={tasks}
        columnDefs={taskColumnDefs}
      />
    </div>
  );
}