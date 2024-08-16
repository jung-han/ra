import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Schedule } from './types';
import dummyScheduleMap from './dummyScheduleMap';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  console.log(schedulesMap);

  return (
    <ScheduleContext.Provider value={{ schedulesMap, setSchedulesMap }}>
      {children}
    </ScheduleContext.Provider>
  );
};
