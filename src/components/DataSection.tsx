'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown, Search as SearchIcon, X } from 'lucide-react';
import { Client, Worker, Task } from '@/types';

// Map generic types for safety
type DataMap = { clients: Client; workers: Worker; tasks: Task };
type EntityType = keyof DataMap;

interface DataSectionProps<K extends EntityType> {
  entityType: K;
  title: string;
  data: DataMap[K][];
  columnDefs: ColumnDef<DataMap[K]>[];
}

export function DataSection<K extends EntityType>({
  entityType,
  title,
  data,
  columnDefs,
}: DataSectionProps<K>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<DataMap[K][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Determine which data to show: Filtered results OR the full dataset
  const displayData = filteredData ?? data;

  // Initialize TanStack Table
  const table = useReactTable({
    data: displayData,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setFilteredData(null);

    // Prepare the promise for Sonner toast
    const searchPromise = fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery, data, entityType }),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Search failed');
      }
      return res.json();
    });

    toast.promise(searchPromise, {
      loading: 'Asking AI to filter...',
      success: (result) => {
        setFilteredData(result);
        return `Found ${result.length} matches.`;
      },
      error: (err) => err.message || 'Search failed',
      finally: () => setIsLoading(false),
    });
  };

  const clearSearch = () => {
    setFilteredData(null);
    setSearchQuery('');
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 border rounded-lg p-4 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            disabled={data.length === 0}
            className="w-full flex justify-between p-0 h-auto hover:bg-transparent"
          >
            <span className="text-lg font-semibold text-slate-800">
              {title} <span className="text-slate-400 font-normal">({data.length})</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 text-slate-400" />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        {/* Search Bar */}
        <div className="flex w-full items-center space-x-2 my-4 pt-4 border-t">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={`Ask AI: "Show me ${title.toLowerCase()} where..."`}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading || !searchQuery}>
            {isLoading ? '...' : 'Filter'}
          </Button>
          {filteredData && (
            <Button variant="outline" size="icon" onClick={clearSearch} title="Clear Filter">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* The Shadcn/TanStack Table */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap px-4 py-3 font-bold text-slate-700">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-slate-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columnDefs.length}
                      className="h-24 text-center text-slate-500"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}