"use client";
import { useDataStore } from '@/store/useDataStore';
import { clientColumnDefs, workerColumnDefs, taskColumnDefs } from '@/lib/columnDefs';
import { DataSection } from './DataSection';

export function DataViewer() {
  const { clients, workers, tasks } = useDataStore();

  return (
    <div className="w-full space-y-4">
      <DataSection
      key ="clients"
        entityType="clients"
        title="Clients"
        data={clients}
        columnDefs={clientColumnDefs}
      />
      <DataSection
      key="workers"
        entityType="workers"
        title="Workers"
        data={workers}
        columnDefs={workerColumnDefs}
      />
      <DataSection
      key="tasks"
        entityType="tasks"
        title="Tasks"
        data={tasks}
        columnDefs={taskColumnDefs}
      />
    </div>
  );
}