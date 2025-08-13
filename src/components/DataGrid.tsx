// 'use client';
// import { AgGridReact } from 'ag-grid-react';
// import { ColDef, CellClassParams, CellValueChangedEvent } from 'ag-grid-community';
// import { useDataStore } from '@/store/useDataStore';
// import { Client, Worker, Task } from '@/types';

// // Your type definitions and type guard remain the same
// type DataMap = {
//   clients: Client;
//   workers: Worker;
//   tasks: Task;
// };
// type EntityType = keyof DataMap;

// interface DataGridProps<K extends EntityType> {
//   entityType: K;
//   rowData: DataMap[K][];
//   columnDefs: ColDef<DataMap[K]>[];
// }

// function isValidKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
//   return key in obj;
// }

// // This is now a simple, "dumb" component that just renders the grid.
// // All the useState and useEffect logic has been removed.
// export function DataGrid<K extends EntityType>({ entityType, rowData, columnDefs }: DataGridProps<K>) {
//   const { updateCell, validationErrors } = useDataStore();

//   const getCellClass = (params: CellClassParams<DataMap[K]>) => {
//     if (!params.colDef || !params.node || typeof params.node.rowIndex !== 'number') {
//       return '';
//     }
//     const hasError = validationErrors.some(
//       (err) =>
//         err.entityType === entityType &&
//         err.rowIndex === params.node.rowIndex &&
//         err.field === params.colDef.field
//     );
//     return hasError ? 'ag-cell-error' : '';
//   };

//   const handleCellValueChanged = (event: CellValueChangedEvent<DataMap[K]>) => {
//     const { colDef, newValue, node, data } = event;
//     if (!colDef.field || !data || node.rowIndex === null ) {
//       return;
//     }
//     const field = colDef.field;
//     if (isValidKey(data, field)) {
//       updateCell(entityType, node.rowIndex, field, newValue);
//     } 
//     // else {
//       // console.warn(`[DataGrid] Attempted to update an invalid or nested field: "${String(field)}"`);
//     // }
//   };

//   return (
//     <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
//       <AgGridReact<DataMap[K]>
//         rowData={rowData}
//         columnDefs={columnDefs}
//         domLayout="autoHeight"
//         defaultColDef={{
//           sortable: true,
//           filter: true,
//           resizable: true,
//           editable: true,
//           cellClass: getCellClass,
//         }}
//         onCellValueChanged={handleCellValueChanged}
//         stopEditingWhenCellsLoseFocus={true}
//       />
//     </div>
//   );
// }