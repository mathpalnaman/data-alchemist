'use client';
import { useDataStore } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Client, Worker, Task } from '@/types'; // Import types

export function ExportControls() {
    const { clients, workers, tasks, rules, priorities, validationErrors } = useDataStore();

    const handleExport = async () => {
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

        const exportPromise = (async () => {
            // Export Rules JSON
            const rulesAndPriorities = { rules, priorities };
            const rulesJsonBlob = new Blob([JSON.stringify(rulesAndPriorities, null, 2)], {
                type: "application/json;charset=utf-8"
            });
            saveAs(rulesJsonBlob, "rules.json");

            // Export Excel
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Data Alchemist';
            workbook.created = new Date();

            // Strict Typing: data is an array of one of our known types
            const addSheet = (sheetName: string, data: (Client | Worker | Task)[]) => {
                if (data.length === 0) return;
                
                const sheet = workbook.addWorksheet(sheetName);
                const firstItem = data[0];
                
                // Object.keys returns string[], which ExcelJS accepts for 'key'
                const columns = Object.keys(firstItem).map(key => ({
                    header: key,
                    key: key,
                    width: 20
                }));
                
                sheet.columns = columns;
                
                // ExcelJS addRows accepts any object, but we know it's our typed data
                sheet.addRows(data);
            };

            addSheet('Clients', clients);
            addSheet('Workers', workers);
            addSheet('Tasks', tasks);

            const buffer = await workbook.xlsx.writeBuffer();
            const excelBlob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            saveAs(excelBlob, "cleaned_data.xlsx");
        })();

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