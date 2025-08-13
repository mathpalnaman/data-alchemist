'use client';
import { useDataStore } from '@/store/useDataStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function PrioritizationSliders() {
  const { priorities, updatePriorities } = useDataStore();

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <div className="flex justify-between">
            <Label htmlFor="prio-level">Priority Level Fulfillment</Label>
            <span className="font-semibold">{priorities.priorityLevelFulfillment}%</span>
        </div>
        <Slider
          id="prio-level"
          defaultValue={[priorities.priorityLevelFulfillment]}
          onValueChange={([value]) => updatePriorities({ priorityLevelFulfillment: value })}
          max={100}
          step={1}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between">
            <Label htmlFor="task-comp">Task Completion</Label>
            <span className="font-semibold">{priorities.taskCompletion}%</span>
        </div>
        <Slider
          id="task-comp"
          defaultValue={[priorities.taskCompletion]}
          onValueChange={([value]) => updatePriorities({ taskCompletion: value })}
          max={100}
          step={1}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between">
            <Label htmlFor="fair-dist">Fair Distribution</Label>
            <span className="font-semibold">{priorities.fairDistribution}%</span>
        </div>
        <Slider
          id="fair-dist"
          defaultValue={[priorities.fairDistribution]}
          onValueChange={([value]) => updatePriorities({ fairDistribution: value })}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
}