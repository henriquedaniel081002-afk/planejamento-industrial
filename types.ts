
export interface ProductionItem {
  id: string;
  product: string;   // Renamed from description
  startTime: string; // ISO string for sorting/logic
  endTime: string;   // ISO string
  speed: number;
  simultaneousCoils: number;
  avgLength: number;
  totalCoils: number;
  palletChanges: number;
  plannedQuantity: number; // New field
  
  // Calculated fields
  setupCount: number;
  setupTimeTotal: number; // minutes
  runTimeMinutes: number; // minutes
  palletTimeTotal: number; // minutes
  totalDurationMinutes: number; // minutes
}

export interface ProductionInput {
  product: string; // Renamed from description
  startTime: string; // "HH:mm"
  speed: number;
  simultaneousCoils: number;
  avgLength: number;
  totalCoils: number;
  palletChanges: number;
  plannedQuantity: number; // New field
}