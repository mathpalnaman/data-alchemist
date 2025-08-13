'use client';
import { useDataStore } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function ExportControls() {
    const { clients, workers, tasks, rules, priorities, validationErrors } = useDataStore();

    const handleExport = () => {
        if (validationErrors.length > 0) {
            toast.error("Cannot export with validation errors.", {
                description: "Please fix all errors before exporting your data.",
            });
            return;
        }
        if (clients.length === 0 && workers.length === 0 && tasks.length === 0) {
            toast.warning("No data to export.", {
                description: "Please upload at least one data file.",
            });
            return;
        }

        const exportPromise = new Promise<void>((resolve) => {
            // 1. Create rules.json
            const rulesAndPriorities = {
                rules,
                priorities,
            };
            const rulesJsonBlob = new Blob([JSON.stringify(rulesAndPriorities, null, 2)], {
                type: "application/json;charset=utf-8"
            });
            saveAs(rulesJsonBlob, "rules.json");

            // 2. Create Excel workbook with cleaned data
            const workbook = XLSX.utils.book_new();
            if (clients.length > 0) {
                const clientSheet = XLSX.utils.json_to_sheet(clients);
                XLSX.utils.book_append_sheet(workbook, clientSheet, "Clients");
            }
            if (workers.length > 0) {
                const workerSheet = XLSX.utils.json_to_sheet(workers);
                XLSX.utils.book_append_sheet(workbook, workerSheet, "Workers");
            }
            if (tasks.length > 0) {
                const taskSheet = XLSX.utils.json_to_sheet(tasks);
                XLSX.utils.book_append_sheet(workbook, taskSheet, "Tasks");
            }

            // 3. Save the workbook
            XLSX.writeFile(workbook, "cleaned_data.xlsx");

            resolve();
        });

        toast.promise(exportPromise, {
            loading: 'Generating export files...',
            success: 'Export successful! Check your downloads.',
            error: 'An error occurred during export.',
        });
    };

    return (
        <Button onClick={handleExport} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Export All Data & Rules
        </Button>
    );
}