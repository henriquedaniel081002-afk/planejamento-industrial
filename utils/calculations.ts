
import { ProductionInput, ProductionItem } from '../types';

export const calculateProduction = (input: ProductionInput): ProductionItem => {
  const {
    product,
    startTime, 
    speed,
    simultaneousCoils,
    avgLength,
    totalCoils,
    palletChanges,
    plannedQuantity
  } = input;

  // 1. Calculate Run Time (Tempo de Puxada)
  // Guard against division by zero to avoid Infinity
  const safeSpeed = speed > 0 ? speed : 1;
  const safeSimultaneousCoils = simultaneousCoils > 0 ? simultaneousCoils : 1;

  const runTimeMinutes = (avgLength * totalCoils) / (safeSpeed * safeSimultaneousCoils);

  // 2. Calculate Setup Time
  const setupCount = Math.ceil(totalCoils / safeSimultaneousCoils);
  const setupTimeTotal = setupCount * 10; // 10 minutes per setup

  // 3. Calculate Pallet Change Time
  const palletTimeTotal = palletChanges * 3; // 3 minutes per change

  // 4. Total Duration
  const totalDurationMinutes = runTimeMinutes + setupTimeTotal + palletTimeTotal;

  // 5. Calculate Start and End Time Date Objects
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  // Safely parse HH:mm
  if (startTime && typeof startTime === 'string' && startTime.includes(':')) {
      const parts = startTime.split(':').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          hours = parts[0];
          minutes = parts[1];
      }
  }
  
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  
  // Fallback if date is invalid
  if (isNaN(startDate.getTime())) {
      startDate.setTime(Date.now());
  }

  // Ensure duration is a finite number
  const safeDuration = (isFinite(totalDurationMinutes) && !isNaN(totalDurationMinutes)) ? totalDurationMinutes : 0;
  
  const endDate = new Date(startDate.getTime() + safeDuration * 60000);

  // Fallback if end date is invalid
  if (isNaN(endDate.getTime())) {
      endDate.setTime(startDate.getTime());
  }

  return {
    id: crypto.randomUUID(),
    product,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    speed,
    simultaneousCoils,
    avgLength,
    totalCoils,
    palletChanges,
    plannedQuantity,
    setupCount,
    setupTimeTotal,
    runTimeMinutes,
    palletTimeTotal,
    totalDurationMinutes: safeDuration
  };
};

export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '--:--';
  }
};

export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--/--';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  } catch (e) {
    return '--/--';
  }
};

export const formatDuration = (minutes: number): string => {
  if (!isFinite(minutes) || isNaN(minutes)) return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h}h ${m}m`;
};
