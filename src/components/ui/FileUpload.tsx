'use client';
import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import * as XLSX from 'xlsx'; // Importing XLSX for file parsing
import { Client, Worker, Task } from '@/types';

type EntityType = 'clients' | 'workers' | 'tasks';

interface FileUploadProps {
  entityType: EntityType;
  title: string;
}

export function FileUpload({ entityType, title }: FileUploadProps) {
  const [fileName, setFileName] = useState('');
  const setData = useDataStore((state) => state.setData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
      
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const promise = new Promise<void>((resolve, reject) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // Convert to JSON with empty strings for missing values and using defval to ensure empty cells are parsed as empty strings

          switch (entityType) {
            case 'clients':
                setData('clients', jsonData as Client[]);
                break;
            case 'workers':
                setData('workers', jsonData as Worker[]);
                break;
            case 'tasks':
                setData('tasks', jsonData as Task[]);
                break;
            default:

            const exhaustiveCheck: never = entityType;
            throw new Error(`Unhandled entity type: ${exhaustiveCheck}`);
  }
          resolve();

        } catch (error) {
          console.error("Error parsing file:", error);
          reject(error);
        }
      });

      toast.promise(promise, {
        loading: `Parsing ${file.name}...`,
        success: `Successfully loaded data from ${file.name}.`,
        error: `Error parsing ${file.name}. Please check the file format.`,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={entityType} className="font-semibold">{title}</Label>
      <Input
        id={entityType}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
        className="cursor-pointer file:text-blue-700 file:font-semibold"
      />
      {fileName && <p className="text-sm text-slate-500 mt-1 truncate">Loaded: {fileName}</p>}
    </div>
  );
}