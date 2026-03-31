import { parseISO, startOfWeek, endOfWeek, format, startOfMonth } from 'date-fns';
import type { ShiftData } from '../types';
import { getDurationMins } from './timeHelpers';

const PRODUCTIVE_CATEGORIES = ['Online', 'AD HOC'];

export interface AggregatedStats {
   productiveMins: number;
   otherMins: number;
   totalMins: number;
   entriesCount: number;
   dayKeys: string[];
}

export function calculateDailyStats(segments: any[]): AggregatedStats {
  let prod = 0; let other = 0;
  segments.forEach(seg => {
    if(!seg.startTime || !seg.endTime) return;
    const dur = getDurationMins(seg.startTime, seg.endTime);
    if(PRODUCTIVE_CATEGORIES.includes(seg.category)) prod += dur;
    else other += dur;
  });
  return { productiveMins: prod, otherMins: other, totalMins: prod + other, entriesCount: segments.length, dayKeys: [] };
}

// Group dates into periods
export interface ReportGroup {
  id: string;
  title: string;
  type: 'week' | 'month';
  stats: AggregatedStats;
  dayKeys: string[];  // sorted list of dates YYYY-MM-DD
}

export function aggregateData(data: ShiftData): { weeks: ReportGroup[], months: ReportGroup[] } {
  const allDates = Object.keys(data).sort().reverse(); // newest first
  
  const weekMap = new Map<string, ReportGroup>();
  const monthMap = new Map<string, ReportGroup>();

  allDates.forEach(dateStr => {
    const dateObj = parseISO(dateStr);
    
    // WEEK MAP (Monday as start of week)
    const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(dateObj, { weekStartsOn: 1 });
    const weekId = `week-${format(weekStart, 'yyyy-MM-dd')}`;
    const weekTitle = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    
    // MONTH MAP
    const monthStart = startOfMonth(dateObj);
    const monthId = `month-${format(monthStart, 'yyyy-MM')}`;
    const monthTitle = format(monthStart, 'MMMM yyyy');

    const dayStats = calculateDailyStats(data[dateStr].segments);
    
    if(!weekMap.has(weekId)) {
      weekMap.set(weekId, { id: weekId, type: 'week', title: weekTitle, stats: { productiveMins: 0, otherMins: 0, totalMins: 0, entriesCount: 0, dayKeys: [] }, dayKeys: [] });
    }
    const wg = weekMap.get(weekId)!;
    wg.dayKeys.push(dateStr);
    wg.stats.productiveMins += dayStats.productiveMins;
    wg.stats.otherMins += dayStats.otherMins;
    wg.stats.totalMins += dayStats.totalMins;

    if(!monthMap.has(monthId)) {
      monthMap.set(monthId, { id: monthId, type: 'month', title: monthTitle, stats: { productiveMins: 0, otherMins: 0, totalMins: 0, entriesCount: 0, dayKeys: [] }, dayKeys: [] });
    }
    const mg = monthMap.get(monthId)!;
    mg.dayKeys.push(dateStr);
    mg.stats.productiveMins += dayStats.productiveMins;
    mg.stats.otherMins += dayStats.otherMins;
    mg.stats.totalMins += dayStats.totalMins;
  });

  return {
    weeks: Array.from(weekMap.values()),
    months: Array.from(monthMap.values())
  };
}
