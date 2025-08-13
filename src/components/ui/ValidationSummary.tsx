'use client';
import { useDataStore } from '@/store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck } from 'lucide-react'; // Importing icons for visual feedback

export function ValidationSummary() {
  const errors = useDataStore((state) => state.validationErrors); // Accessing validation errors from the data store

  if (errors.length === 0) {
    return (
      <Card className="border-green-300">
        <CardHeader><CardTitle className="flex items-center gap-2 text-green-700">
            <ShieldCheck /> Validation Summary
        </CardTitle></CardHeader>
        <CardContent><p className="text-green-600">All checks passed! No errors found.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-300">
        <CardHeader><CardTitle className="flex items-center gap-2 text-red-700">
            <ShieldAlert /> Validation Summary ({errors.length} errors)
        </CardTitle></CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <ul className="space-y-2">
          {errors.map((err, i) => (
            <li key={i} className="text-sm text-red-900 bg-red-50 p-2 rounded-md">
              <span className="font-bold capitalize">{err.entityType}</span> at row {err.rowIndex + 1}, field <span className="font-mono bg-red-200 px-1 rounded">{err.field}</span>: {err.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}