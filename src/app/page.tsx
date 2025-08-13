import { FileUp, Search, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/FileUpload';
import { DataViewer } from '@/components/ui/DataViewer';
import { ValidationSummary } from '@/components/ui/ValidationSummary';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Data Alchemist 🧪
          </h1>
          <p className="text-slate-500 mt-2">
            Forge your own AI resource-allocation configurator. Upload your data to begin.
          </p>
        </header>

{/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              1. Upload Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
            <FileUpload entityType="clients" title="Clients Data" />
            <FileUpload entityType="workers" title="Workers Data" />
            <FileUpload entityType="tasks" title="Tasks Data" />
          </CardContent>
        </Card>

{/* Data Viewing & Validation Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                   2. View, Edit & Validate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Once uploaded, view and edit your datasets. Validations will run automatically.
                </p>
                <DataViewer />
              </CardContent>
            </Card>
          </div>
          <div>
             <ValidationSummary />
          </div>
        </div>

      </div>
    </main>
  );
}