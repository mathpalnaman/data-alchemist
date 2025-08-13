// 'use client';
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // Importing Dialog components for modal functionality
// import { DataGrid } from '@/components/DataGrid';
// import { ColDef } from 'ag-grid-community';
// import { Client, Worker, Task } from '@/types';

// type DataMap = {
//   clients: Client;
//   workers: Worker;
//   tasks: Task;
// };
// type EntityType = keyof DataMap;

// interface DataDialogProps<K extends EntityType> {
//   entityType: K;
//   title: string;
//   data: DataMap[K][];
//   columnDefs: ColDef<DataMap[K]>[];
// }

// export function DataDialog<K extends EntityType>({
//   entityType,
//   title,
//   data,
//   columnDefs,
// }: DataDialogProps<K>) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredData, setFilteredData] = useState<DataMap[K][] | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   // const [isOpen, setIsOpen] = useState(false);
//   const [isGridVisible, setIsGridVisible] = useState(false);

//   // useEffect(() => {
//   //   if(isOpen) {
//   //     const timer = setTimeout(() => {
//   //       setIsGridReady(true);
//   //     }, 100); // Delay to ensure dialog is fully open before grid is ready
//   //     return () => clearTimeout(timer);
//   //   }
//   //   else {
//   //     setIsGridReady(false);
//   //   }
//   // }, [isOpen]);

//   const handleSearch = async () => {
//     if (!searchQuery) return;
//     setIsLoading(true);
//     setFilteredData(null);

//     try {
//       const response = await fetch('/api/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: searchQuery, data, entityType }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Search request failed');
//       }

//       const result = await response.json();
//       setFilteredData(result);

//       toast.success('Search complete', {
//         description: `Found ${result.length} matching results for "${searchQuery}".`,
//       });
//     } catch (error) {
//       let errorMessage = 'Could not perform search.';
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       toast.error('Search Error', {
//         description: errorMessage,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setFilteredData(null);
//     setSearchQuery('');
//   };

//   return (
//     <Dialog onOpenChange={(open)=> { if (!open) setIsGridVisible(false);}}>
//       <DialogTrigger asChild>
//         <Button variant="outline" disabled={data.length === 0}>
//           View {title} ({data.length})
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-6xl">
//         <DialogHeader>
//           <DialogTitle>{title} Data</DialogTitle>
//         </DialogHeader>

//         <div className="flex w-full items-center space-x-2 my-4">
//           <Input
//             type="text"
//             placeholder="e.g., priority less than 3"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <Button onClick={handleSearch} disabled={isLoading || !searchQuery}>
//             {isLoading ? 'Searching...' : 'Search'}
//           </Button>
//           <Button variant="ghost" onClick={clearSearch}>
//             Clear
//           </Button>
//         </div>

//         {isGridVisible ? (
//         <DataGrid
//           entityType={entityType}
//           rowData={filteredData ?? data}
//           columnDefs={columnDefs}
//         />
//         ) : (
//           <div style={{ height: 500 }} className="flex flex-col items-center justify-center bg-slate-50 round-lg">
//             <p className="mb-4 text-slate-600">Data is ready to be displayed.</p>
//             <Button onClick={() => setIsGridVisible(true)}>Load Grid</Button>
//             </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }