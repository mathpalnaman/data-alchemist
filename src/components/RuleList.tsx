'use client';
import { useDataStore } from '@/store/useDataStore';
import { Rule } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const renderRule = (rule: Rule) => {
    switch (rule.type) {
        case 'coRun':
            return <><strong>Co-run:</strong> Tasks {rule.tasks.map(t => <Badge key={t} variant="secondary" className="mx-1">{t}</Badge>)} must run together.</>;
        case 'loadLimit':
            return <><strong>Load Limit:</strong> Workers in group <Badge variant="secondary">{rule.workerGroup}</Badge> cannot exceed <strong>{rule.maxSlotsPerPhase}</strong> slots per phase.</>;
        default:
            return 'Unknown rule';
    }
}

export function RuleList() {
  const { rules, deleteRule } = useDataStore();

  if (rules.length === 0) {
    return <p className="text-sm text-slate-500">No business rules defined yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {rules.map((rule, index) => (
        <li key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
          <span className="text-sm text-slate-700">{renderRule(rule)}</span>
          <Button variant="ghost" size="icon" onClick={() => deleteRule(index)}>
            <X className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}