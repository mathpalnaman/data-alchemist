import { create } from 'zustand';
import { Client, Worker, Task, ValidationError, Rule, Priorities } from '@/types';
import { validateAllData } from '@/lib/validators';

type DataMap = {
  clients: Client;
  workers: Worker;
  tasks: Task;
};

type EntityType = keyof DataMap;

interface AppState {
  // State Properties
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  validationErrors: ValidationError[];
  rules: Rule[];
  priorities: Priorities;

  // Actions
  setData: <K extends EntityType>(entityType: K, data: DataMap[K][]) => void;
  updateCell: <K extends EntityType, F extends keyof DataMap[K]>(
    entityType: K,
    rowIndex: number,
    field: F,
    value: DataMap[K][F]
  ) => void;
  runAllValidations: () => void;
  addRule: (rule: Rule) => void;
  deleteRule: (ruleIndex: number) => void;
  updatePriorities: (newPriorities: Partial<Priorities>) => void;
}

export const useDataStore = create<AppState>((set, get) => ({
  // Initial State
  clients: [],
  workers: [],
  tasks: [],
  validationErrors: [],
  rules: [],
  priorities: {
    priorityLevelFulfillment: 70,
    taskCompletion: 80,
    fairDistribution: 50,
  },

  // Actions Implementation
  setData: (entityType, data) => {
    // Spreading the existing state to maintain type integrity.
    set((state) => ({
      ...state,
      [entityType]: data,
    }));
    get().runAllValidations();
  },

  updateCell: (entityType, rowIndex, field, value) => {
    set((state) => {
      const currentData = state[entityType];
      const newData = [...currentData];

      if (newData[rowIndex]) {
        newData[rowIndex] = { ...newData[rowIndex], [field]: value };
      }
      
      return { ...state, [entityType]: newData };
    });
    get().runAllValidations();
  },

  runAllValidations: () => {
    const { clients, workers, tasks } = get();
    const errors = validateAllData({ clients, workers, tasks });
    set({ validationErrors: errors });
  },

  addRule: (rule) => {
    set((state) => ({ rules: [...state.rules, rule] }));
  },

  deleteRule: (ruleIndex) => {
    set((state) => ({
      rules: state.rules.filter((_, index) => index !== ruleIndex),
    }));
  },

  updatePriorities: (newPriorities) => {
    set((state) => ({
      priorities: { ...state.priorities, ...newPriorities },
    }));
  },
}));