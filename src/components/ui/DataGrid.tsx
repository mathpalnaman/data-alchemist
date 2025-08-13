'use client';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, CellClassParams, CellValueChangedEvent } from 'ag-grid-community'; // Importing types for type safety
import { useDataStore } from '@/store/useDataStore';
import { Client, Worker, Task } from '@/types';

type DataMap = {
  clients: Client;
  workers: Worker;
  tasks: Task;
};
type EntityType = keyof DataMap;

interface DataGridProps<K extends EntityType> {
  entityType: K;
  rowData: DataMap[K][];
  columnDefs: ColDef<DataMap[K]>[]; // Using ColDef with the specific type for type safety
}

// This is a generic type guard function
// It will check if a given 'key' is a valid property of the object 'obj'
// The special return type 'key is keyof T' is what informs TypeScript
// Using this to avoid overriding the type safety of the 'field' property in column definitions and not to skip a safety check
function isValidKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

export function DataGrid<K extends EntityType>({ entityType, rowData, columnDefs }: DataGridProps<K>) {
  const { updateCell, validationErrors } = useDataStore();

  const getCellClass = (params: CellClassParams<DataMap[K]>) => {
    if (!params.colDef || !params.node || typeof params.node.rowIndex !== 'number') { // Ensure colDef and node are valid
      return '';
    }
    const hasError = validationErrors.some(
      (err) =>
        err.entityType === entityType &&
        err.rowIndex === params.node.rowIndex &&
        err.field === params.colDef.field
    );
    return hasError ? 'ag-cell-error' : '';
  };


  const handleCellValueChanged = (event: CellValueChangedEvent<DataMap[K]>) => { // This function is called when a cell value is changed

    const { colDef, newValue, node, data } = event;

    if (!colDef.field || typeof node.rowIndex !== 'number' || !data) { // Ensure colDef and node are valid
      return;
    }

    const field = colDef.field;

    // This is the runtime safety check
    if (isValidKey(data, field)) {
      // Inside this 'if' block, TypeScript now knows that `field` is a valid `keyof DataMap[K]`.
      // The error is gone, and the code is fully type-safe.
      updateCell(entityType, node.rowIndex, field, newValue);
    } else {
      // This case would only happen if you used a nested field like 'address.street'
      console.warn(`[DataGrid] Attempted to update an invalid or nested field: "${String(field)}"`);
    }
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
      <AgGridReact<DataMap[K]>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          editable: true,
          cellClass: getCellClass,
        }}
        onCellValueChanged={handleCellValueChanged}
        stopEditingWhenCellsLoseFocus={true}
        domLayout="autoHeight"
      />
    </div>
  );
}