export const formatSlots = (slots: string[]): string[] =>
    slots.map((s) => {
      const [h, m] = s.split(":");
      const hour = parseInt(h, 10) % 12 || 12;
      const ampm = parseInt(h, 10) < 12 ? "AM" : "PM";
      return `${hour}:${m} ${ampm}`;
    });
  
  export const generateSlots = (
    start: string,
    end: string,
    intervalMins: number
  ): { id: string; label: string }[] => {
    const slots: { id: string; label: string }[] = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    while (h < eh || (h === eh && m <= em)) {
      const id = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      slots.push({ id, label: formatSlots([id])[0] });
      m += intervalMins;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
    }
    return slots;
  };
  