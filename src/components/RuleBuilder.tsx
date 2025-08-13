'use client';
import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect, OptionType } from '@/components/ui/MultiSelect';
import { Rule } from '@/types';
import { toast } from 'sonner';

export function RuleBuilder() {
  const { tasks, workers, addRule } = useDataStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ruleType, setRuleType] = useState<'coRun' | 'loadLimit' | ''>('');

  // State for coRun rule
  const [coRunTasks, setCoRunTasks] = useState<string[]>([]);

  // State for loadLimit rule
  const [loadLimitGroup, setLoadLimitGroup] = useState('');
  const [loadLimitMaxSlots, setLoadLimitMaxSlots] = useState(0);
  // Options for task and worker group selection
  const taskOptions: OptionType[] = tasks.map(t => ({ value: t.TaskID, label: `${t.TaskID}: ${t.TaskName}` }));
  const workerGroupOptions: OptionType[] = [...new Set(workers.map(w => w.WorkerGroup))]
    .filter(Boolean)
    .map(g => ({ value: g, label: g }));

  const handleSaveRule = () => {
    let newRule: Rule | null = null;
    if (ruleType === 'coRun' && coRunTasks.length >= 2) {
      newRule = { type: 'coRun', tasks: coRunTasks };
    } else if (ruleType === 'loadLimit' && loadLimitGroup && loadLimitMaxSlots > 0) {
      newRule = { type: 'loadLimit', workerGroup: loadLimitGroup, maxSlotsPerPhase: loadLimitMaxSlots };
    }

    if (newRule) {
      addRule(newRule);
      toast.success(`Rule '${ruleType}' created successfully!`);
      resetAndClose();
    } else {
      toast.error('Invalid rule configuration. Please check your inputs.');
    }
  };

  const resetAndClose = () => {
    setRuleType('');
    setCoRunTasks([]);
    setLoadLimitGroup('');
    setLoadLimitMaxSlots(0);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add New Rule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Business Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label>Rule Type</Label>
          <Select onValueChange={(value: 'coRun' | 'loadLimit') => setRuleType(value)}>
            <SelectTrigger><SelectValue placeholder="Select a rule type..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="coRun">Co-run Tasks</SelectItem>
              <SelectItem value="loadLimit">Worker Load Limit</SelectItem>
            </SelectContent>
          </Select>

          {ruleType === 'coRun' && (
            <div className="space-y-2">
              <Label>Select Tasks (2 or more)</Label>
              <MultiSelect
                options={taskOptions}
                selected={coRunTasks}
                onChange={setCoRunTasks}
                placeholder="Select tasks to run together..."
              />
            </div>
          )}

          {ruleType === 'loadLimit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Worker Group</Label>
                <Select onValueChange={setLoadLimitGroup}>
                  <SelectTrigger><SelectValue placeholder="Select a worker group..." /></SelectTrigger>
                  <SelectContent>
                    {workerGroupOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Slots per Phase</Label>
                <Input 
                  type="number" 
                  value={loadLimitMaxSlots}
                  onChange={e => setLoadLimitMaxSlots(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
            <DialogClose asChild><Button variant="ghost" onClick={resetAndClose}>Cancel</Button></DialogClose>
            <Button onClick={handleSaveRule} disabled={!ruleType}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}