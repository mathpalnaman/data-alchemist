import { create } from 'zustand'; // Zustand for state management
import { Client, Worker, Task, ValidationError } from '@/types';
import { validateAllData } from '@/lib/validators'; // Importing the validation function

// 'type' will map the string identifier to the corresponding entity type
type DataMap = {
  clients: Client;
  workers: Worker;
  tasks: Task;
};

// keyof DataMap ensures EntityType to only be 'clients', 'workers', or 'tasks'
type EntityType = keyof DataMap;

interface AppState {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  validationErrors: ValidationError[];

  // 'K' ensures that if entityType is 'clients', then 'data' must be of type Client[]
  setData: <K extends EntityType>(entityType: K, data: DataMap[K][]) => void;

  // 'F' is being used in similar to 'K' but this time for the field name
  updateCell: <K extends EntityType, F extends keyof DataMap[K]>(
    entityType: K,
    rowIndex: number,
    field: F,
    value: DataMap[K][F]
  ) => void;

  runAllValidations: () => void;
}

// V

export const useDataStore = create<AppState>((set, get) => ({ // Initial state
  clients: [],
  workers: [],
  tasks: [],
  validationErrors: [],

  setData: (entityType, data) => {
    set({ [entityType]: data });
    get().runAllValidations(); // Re-validate whenever data is set
  },

  updateCell: (entityType, rowIndex, field, value) => {
    set((state) => {
      const currentData = state[entityType];
      
      // Creating a shallow copy to avoid direct state mutation
      const newData = [...currentData];

      if (newData[rowIndex]) {
          newData[rowIndex] = { ...newData[rowIndex], [field]: value }; // Update the specific field
      }

      return { [entityType]: newData };
    });
    get().runAllValidations(); // Re-validate whenever a cell is edited
  },

  runAllValidations: () => {
    console.log("Running validations...");
    const { clients, workers, tasks } = get();
    const errors = validateAllData({ clients, workers, tasks });
    set({ validationErrors: errors });
  },
}));