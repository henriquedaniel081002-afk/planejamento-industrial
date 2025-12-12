
import React from 'react';
import { ProductionItem } from '../types';
import { Clock, Layers, Zap, ClipboardList } from 'lucide-react';
import { formatDuration } from '../utils/calculations';

interface SummaryCardsProps {
  items: ProductionItem[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ items }) => {
  const totalCoils = items.reduce((acc, item) => acc + item.totalCoils, 0);
  const totalDuration = items.reduce((acc, item) => acc + item.totalDurationMinutes, 0);
  const totalPlannedQty = items.reduce((acc, item) => acc + item.plannedQuantity, 0);
  const avgSpeed = items.length > 0 
    ? Math.round(items.reduce((acc, item) => acc + item.speed, 0) / items.length) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Qtde Planejada - New Card */}
      <div className="bg-gray-900 border border-gray-800 p-5 md:p-6 rounded-lg shadow-xl flex items-center justify-between hover:border-orange-500/30 transition-colors">
        <div>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">Qtde Planejada</p>
          <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">{totalPlannedQty.toLocaleString('pt-BR')}</p>
        </div>
        <div className="p-3 md:p-4 bg-white rounded-full text-black">
          <ClipboardList size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 md:p-6 rounded-lg shadow-xl flex items-center justify-between hover:border-orange-500/30 transition-colors">
        <div>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">Total Bobinas</p>
          <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">{totalCoils.toLocaleString('pt-BR')}</p>
        </div>
        <div className="p-3 md:p-4 bg-orange-600 rounded-full text-white">
          <Layers size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 md:p-6 rounded-lg shadow-xl flex items-center justify-between hover:border-orange-500/30 transition-colors">
        <div>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">Tempo Produção</p>
          <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">{formatDuration(totalDuration)}</p>
        </div>
        <div className="p-3 md:p-4 bg-white rounded-full text-black">
          <Clock size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 md:p-6 rounded-lg shadow-xl flex items-center justify-between hover:border-orange-500/30 transition-colors">
        <div>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">Velocidade Média</p>
          <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">{avgSpeed} <span className="text-base md:text-lg font-medium text-gray-500">m/min</span></p>
        </div>
        <div className="p-3 md:p-4 bg-orange-600 rounded-full text-white">
          <Zap size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
