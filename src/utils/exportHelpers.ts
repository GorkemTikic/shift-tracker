import { minsToHm } from './timeHelpers';
import type { ShiftData } from '../types';
import type { ReportGroup } from './historyHelpers';

export function generateAggregateReport(group: ReportGroup, data: ShiftData): string {
  const prodHrs = minsToHm(group.stats.productiveMins);
  const totalHrs = minsToHm(group.stats.totalMins);

  const header = `📆 ${group.type.toUpperCase()} SUMMARY: ${group.title}\nTotal Logged: ${totalHrs} hrs | Productive: ${prodHrs} hrs\n`;

  // Sort logically oldest to newest for the timeline
  const sortedKeys = [...group.dayKeys].sort();

  const daysText = sortedKeys.map(dateStr => {
    const dayData = data[dateStr];
    // If a day was created but zero segments logged and it's not an off day, skip it
    if ((!dayData?.segments || dayData.segments.length === 0) && !dayData?.isOffDay) return null;

    const d = new Date(dateStr);
    const dateTitle = `• ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })}`;

    let segmentsText = "";

    if (dayData.isOffDay) {
      segmentsText = "  [Off-Day]";
    } else {
      segmentsText = dayData.segments.map((seg: any) => {
        let timeText = seg.startTime === seg.endTime 
          ? seg.startTime 
          : `${seg.startTime} - ${seg.endTime}`;
        let text = `  ${timeText} - ${seg.category}`;
        if (seg.notes) text += ` (${seg.notes})`;
        return text;
      }).join('\n');
    }
    
    return `${dateTitle}\n${segmentsText}`;
  }).filter(Boolean).join('\n\n');

  return `${header}\n${daysText}`;
}
