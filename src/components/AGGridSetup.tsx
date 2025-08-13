'use client';

import { useEffect } from 'react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

export function AGGridSetup() {
  useEffect(() => {
    // This is to pass the module inside an array.
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
  }, []);

  return null;
}