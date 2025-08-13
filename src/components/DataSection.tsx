'use cliient';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import { DataGrid } from './DataGrid';
import { ColDef } from 'ag-grid-community';
import { Client, Worker, Task } from '@/types';
import { ChevronsUpDown } from 'lucide-react';

type DatMap = { clients: Client; workers: Worker; tasks: Task };
type EntityType = keyof DatMap;

interface DataSectionProps<K extends EntityType> {
    entityType: K;
    title: string;
    data: DatMap[K][];
    columnDefs: ColDef<DatMap[K]>[];
}

export function DataSection<K extends EntityType>({
    entityType,
    title,
    data,
    columnDefs,
}: DataSectionProps<K>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<DatMap[K][] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // const[displayData, setDisplayData] = useState<DatMap[K][]>(data);
    // useEffect(() => {
    //     if (isOpen) {
    //         setDisplayData(filteredData ?? data);
    //     }
    // }, [isOpen, filteredData, data]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsLoading(true);
        setFilteredData(null);
        const promise = fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, data, entityType }),
    }).then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Search request failed');
        }
        return res.json();
    });

    toast.promise(promise, {
        loading: 'Searching with AI...',
        success: (result) => {
            setFilteredData(result);
            return `Found ${result.length} matching results.`;
        },
        error: (err) => err.message || 'Could not perform search.',
        finally: () => setIsLoading(false)
    });
  };

  const clearSearch = () => {
    setFilteredData(null);
    setSearchQuery('');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2 border rounded-lg p-4">
      <CollapsibleTrigger asChild>
        <button disabled={data.length === 0} className="flex w-full items-center justify-between text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          <span>View {title} ({data.length})</span>
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex w-full items-center space-x-2 my-4 pt-4 border-t">
            <Input
              type="text"
              placeholder={`e.g., in ${title.toLowerCase()} with priority less than 3`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading || !searchQuery}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="ghost" onClick={clearSearch}>Clear</Button>
        </div>
        {/* <DataGrid
          entityType={entityType}
          rowData={filteredData ?? data}
          columnDefs={columnDefs}
        /> */}
        <div className="w-full overflow-x-auto border rounded-lg" style={{ maxHeight: 500 }}>
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-slate-50 sticky top-0">
                    <tr>
                        {columnDefs.map(col => <th key={col.field} className="px-6 py-3">{col.headerName ?? col.field}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {(filteredData ?? data).map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white border-b hover:bg-slate-50">
                            {columnDefs.map(col => <td key={col.field} className="px-6 py-4 truncate" style={{maxWidth: '200px'}}>{String(row[col.field as unknown as keyof typeof row] ?? '')}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
