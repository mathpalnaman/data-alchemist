'use client';

import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Bot } from 'lucide-react';
import { Rule } from '@/types';

export function NaturalLanguageRuleInput() {
  const { tasks, workers, addRule } = useDataStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRule = async () => {
    if (!query) return;

    setIsLoading(true);
    const taskContext = tasks.map(t => t.TaskID);
    const workerGroupContext = [...new Set(workers.map(w => w.WorkerGroup))].filter(Boolean);

    const promise = fetch('/api/create-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, taskContext, workerGroupContext }),
    });

    toast.promise(promise, {
        loading: 'Asking the AI to generate a rule...',
        success: async (res) => {
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || 'Failed to generate rule.');
            }
            const newRule = result as Rule;

            // Show a confirmation toast before adding the rule
            toast("✨ AI Suggestion", {
                description: `The AI suggests this rule: ${JSON.stringify(newRule)}`,
                action: {
                  label: "Accept",
                  onClick: () => {
                    addRule(newRule);
                    toast.success("Rule added!");
                  },
                },
                cancel: {
                    label: "Decline",
                    onClick: () => toast.info("Suggestion declined."),
                },
            });

            setQuery('');
            return 'AI has generated a rule suggestion!';
        },
        error: (err) => err.message || 'An unexpected error occurred.',
        finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="space-y-2">
        <div className="flex w-full items-center space-x-2">
        <Input
            type="text"
            placeholder="e.g., Make tasks T1 and T2 run together"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateRule()}
            disabled={isLoading}
        />
        <Button onClick={handleGenerateRule} disabled={isLoading || !query} className="gap-2">
            <Bot className="h-4 w-4" />
            {isLoading ? 'Generating...' : 'Generate'}
        </Button>
        </div>
        <p className="text-xs text-slate-500 pl-1">Generate a rule using plain English.</p>
    </div>
  );
}