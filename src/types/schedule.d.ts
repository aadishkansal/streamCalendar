export type TimeSlot = {
    id: string;
    startTime: string;
    endTime: string;
  };
  
  export type Schedule = {
    projectId: string;
    timeSlots: TimeSlot[];
  };
  