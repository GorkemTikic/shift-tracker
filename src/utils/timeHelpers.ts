export function hmToMins(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  // Shift is 15:00 to 00:00. "00:00" or times after midnight up to 14:59 conceptually belong to the "next day" 
  // in terms of hours clocked during a shift.
  // We will treat hours 00-14 as 24-38 for easy duration subtraction if they follow a 15+ hour.
  // Wait, the prompt states: Shift is 15:00 - 00:00. The user ends at 00:00 exactly. 
  // So "00:00" is effectively 24:00.
  if (h === 0 && m === 0) return 24 * 60;
  
  return h * 60 + m;
}

export function minsToHm(mins: number): string {
  if (mins < 0) mins = 0;
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 24) h -= 24; // convert 24:00 back to 00:00 usually, but we want input to be literal "HH:mm"
  
  const hd = h.toString().padStart(2, '0');
  const md = m.toString().padStart(2, '0');
  return `${hd}:${md}`;
}

export function getDurationMins(start: string, end: string): number {
  const s = hmToMins(start);
  const e = hmToMins(end);
  // If end time goes into the next day (e.g. start at 23:00, end at 00:00)
  if (e < s) {
    // Treat end time as next day
    return (e + 24 * 60) - s;
  }
  return e - s;
}

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}
