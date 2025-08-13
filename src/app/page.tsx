import { FileUp, Search, ShieldAlert, SlidersHorizontal, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/FileUpload';
import { DataViewer } from '@/components/DataViewer';
import { ValidationSummary } from '@/components/ValidationSummary';
import { RuleBuilder } from '@/components/RuleBuilder';
import { RuleList } from '@/components/RuleList';
import { PrioritizationSliders } from '@/components/PrioritizationSliders';
import { NaturalLanguageRuleInput } from '@/components/NaturalLanguageRuleInput';
import { ExportControls } from '@/components/ExportControls';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Data Alchemist 🧪
          </h1>
          <p className="text-slate-500 mt-2">
            Forge your own AI resource-allocation configurator. Upload your data
            to begin.
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

{/*  Main Content Area  */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side: Data & Validation */}
          <div className="lg:col-span-3 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  2. View, Edit & Validate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  View and edit your datasets. Validations will run
                  automatically.
                </p>
                <DataViewer />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Validation Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ValidationSummary />
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Rules & Priorities */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  3. Define Business Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <NaturalLanguageRuleInput />
                <div className="flex-items-center gap-2">
                  <div className="flex-grow border-t"></div>
                  <span className="text-xs text-slate-400">OR</span>
                  </div>
                  
                <div className="flex justify-end">
                  <RuleBuilder />
                </div>
                <RuleList />
              </CardContent>
            </Card>
            {/* Priority setting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  4. Set Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PrioritizationSliders />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>5. Export</CardTitle>
                <p className="text-sm text-slate-500 pt-1">When all data is clean and rules areset, export your configuration</p>
              </CardHeader>
              <CardContent>
                <ExportControls />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}