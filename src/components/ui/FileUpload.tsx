'use client';

import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileType, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useDataStore } from '@/store/useDataStore';
import { Client, Worker, Task } from '@/types';

interface FileUploadProps {
  entityType: 'clients' | 'workers' | 'tasks';
  title: string;
}

export function FileUpload({ entityType, title }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Connect to store actions
  const setData = useDataStore((state) => state.setData);
  const currentData = useDataStore((state) => state[entityType]);

  const hasData = currentData && currentData.length > 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = (file: File) => {
    setIsLoading(true);

    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          validateAndSetData(json);
        } catch (error) {
          toast.error(`Failed to parse JSON: ${title}`);
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    } else {
      // Default to CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error(results.errors);
            toast.error(`Error parsing CSV: ${results.errors[0].message}`);
            setIsLoading(false);
            return;
          }
          validateAndSetData(results.data);
        },
        error: (error: Error) => {
          toast.error(`CSV Error: ${error.message}`);
          setIsLoading(false);
        }
      });
    }
  };

  const validateAndSetData = (rawData: unknown[]) => {
    try {
      // We assume the raw data is an array of objects (Records)
      const processedData = rawData.map((row) => {
        // cast row to a generic object so we can access properties safely
        const newRow = { ...(row as Record<string, unknown>) };

        // Helper to safely parse string/number to number
        const safeNumber = (val: unknown) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') return Number(val);
            return 0; 
        };

        if (entityType === 'clients') {
          if ('PriorityLevel' in newRow) newRow.PriorityLevel = safeNumber(newRow.PriorityLevel);
        } else if (entityType === 'workers') {
          if ('MaxLoadPerPhase' in newRow) newRow.MaxLoadPerPhase = safeNumber(newRow.MaxLoadPerPhase);
          if ('QualificationLevel' in newRow) newRow.QualificationLevel = safeNumber(newRow.QualificationLevel);
        } else if (entityType === 'tasks') {
          if ('Duration' in newRow) newRow.Duration = safeNumber(newRow.Duration);
          if ('MaxConcurrent' in newRow) newRow.MaxConcurrent = safeNumber(newRow.MaxConcurrent);
        }
        return newRow;
      });

      // 2. Dispatch to store (which triggers validation automatically via store logic)
      if (entityType === 'clients') {
        setData('clients', processedData as unknown as Client[]);
      } else if (entityType === 'workers') {
        setData('workers', processedData as unknown as Worker[]);
      } else if (entityType === 'tasks') {
        setData('tasks', processedData as unknown as Task[]);
      }

      toast.success(`${title} loaded successfully`, {
        description: `${processedData.length} records imported.`
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to process data structure');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer border-2 border-dashed rounded-lg p-6 
        transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center gap-2
        ${isDragOver ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
        ${hasData ? 'bg-green-50 border-green-200' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isLoading ? (
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      ) : hasData ? (
        <FileType className="h-8 w-8 text-green-600" />
      ) : (
        <Upload className="h-8 w-8 text-slate-400 group-hover:text-slate-600 transition-colors" />
      )}

      <div className="space-y-1">
        <p className={`text-sm font-medium ${hasData ? 'text-green-700' : 'text-slate-700'}`}>
          {hasData ? `${currentData.length} records loaded` : `Upload ${title}`}
        </p>
        {!hasData && (
          <p className="text-xs text-slate-500">
            Drag & drop or click to browse (CSV/JSON)
          </p>
        )}
      </div>

      {hasData && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the file input
            // We need to cast to any to pass empty array if strictly typed, 
            // or simply use setData with empty array.
            if (entityType === 'clients') setData('clients', []);
            else if (entityType === 'workers') setData('workers', []);
            else if (entityType === 'tasks') setData('tasks', []);
            
            toast.info(`${title} cleared`);
          }}
          className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
  );
}