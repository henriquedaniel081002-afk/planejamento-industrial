
import React from 'react';
import { ProductionItem } from '../types';
import { formatTime, formatDate, formatDuration } from '../utils/calculations';
import { Trash2, Pencil, Clock, Layers, Wind, ArrowRight } from 'lucide-react';

interface ProductionTableProps {
  items: ProductionItem[];
  onRemove: (id: string) => void;
  onEdit: (item: ProductionItem) => void;
}

const ProductionTable: React.FC<ProductionTableProps> = ({ items, onRemove, onEdit }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-900 rounded-lg border-2 border-gray-800 border-dashed">
        <p className="text-gray-400 text-xl font-medium">Nenhum item planejado.</p>
        <p className="text-gray-500 text-sm mt-3">Clique em "NOVA ORDEM" para começar.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-2xl border border-gray-800 bg-black">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white text-sm uppercase tracking-wider border-b-2 border-gray-800">
              <th className="p-5 font-bold">Produto</th>
              <th className="p-5 font-bold text-center">Qtde Plan.</th>
              <th className="p-5 font-bold text-center">Velocidade</th>
              <th className="p-5 font-bold text-center">Total Bobinas</th>
              <th className="p-5 font-bold text-center">Setups</th>
              <th className="p-5 font-bold text-center">Pallets</th>
              <th className="p-5 font-bold text-center">Início</th>
              <th className="p-5 font-bold text-center">Duração</th>
              <th className="p-5 font-bold text-center text-orange-500">Término</th>
              <th className="p-5 font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-900 transition-colors group">
                <td className="p-5 font-bold text-white text-lg border-l-4 border-transparent group-hover:border-orange-500 transition-all">
                  {item.product}
                </td>
                <td className="p-5 text-center text-white font-bold text-lg">
                  {item.plannedQuantity}
                </td>
                <td className="p-5 text-center text-gray-300 font-medium">
                  {item.speed} <span className="text-xs text-gray-500 font-normal">m/min</span>
                </td>
                <td className="p-5 text-center text-gray-300 font-medium">
                  {item.totalCoils}
                </td>
                <td className="p-5 text-center text-gray-300 font-medium">
                  {item.setupCount}
                </td>
                <td className="p-5 text-center text-gray-300 font-medium">
                  {item.palletChanges}
                </td>
                <td className="p-5 text-center text-gray-300">
                  <div className="flex flex-col">
                      <span className="font-bold text-xl text-white">{formatTime(item.startTime)}</span>
                      <span className="text-xs text-gray-500 font-bold uppercase">{formatDate(item.startTime)}</span>
                  </div>
                </td>
                <td className="p-5 text-center text-gray-300">
                  <div className="flex flex-col">
                      <span className="font-bold text-xl text-white">{formatDuration(item.totalDurationMinutes)}</span>
                      <span className="text-xs text-gray-500 font-bold uppercase">Total</span>
                  </div>
                </td>
                <td className="p-5 text-center text-orange-500 font-bold">
                   <div className="flex flex-col">
                      <span className="text-xl">{formatTime(item.endTime)}</span>
                      <span className="text-xs text-orange-500/60 font-bold uppercase">{formatDate(item.endTime)}</span>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                        onClick={() => onEdit(item)}
                        className="text-gray-500 hover:text-white hover:bg-gray-700 transition-all p-2 rounded-lg"
                        title="Editar"
                    >
                        <Pencil size={20} />
                    </button>
                    <button 
                        onClick={() => onRemove(item.id)}
                        className="text-gray-500 hover:text-white hover:bg-red-600 transition-all p-2 rounded-lg"
                        title="Remover"
                    >
                        <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Hidden on Desktop) */}
      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            {/* Left Accent Border */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-600"></div>
            
            <div className="flex justify-between items-start mb-4 pl-2">
              <h3 className="font-bold text-white text-lg leading-tight w-4/5">{item.product}</h3>
              <div className="flex gap-1">
                 <button 
                    onClick={() => onEdit(item)}
                    className="text-gray-500 hover:text-white p-2"
                >
                    <Pencil size={20} />
                </button>
                <button 
                    onClick={() => onRemove(item.id)}
                    className="text-gray-500 hover:text-red-500 p-2"
                >
                    <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pl-2 mb-4 text-sm">
               <div>
                  <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Qtde Plan.</span>
                  <span className="text-white font-bold text-lg">{item.plannedQuantity}</span>
               </div>
               <div>
                  <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Total Bobinas</span>
                  <span className="text-white font-bold text-lg">{item.totalCoils}</span>
               </div>
               <div>
                  <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Velocidade</span>
                  <span className="text-gray-300 font-medium">{item.speed} m/min</span>
               </div>
               <div>
                  <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Duração</span>
                  <span className="text-gray-300 font-medium">{formatDuration(item.totalDurationMinutes)}</span>
               </div>
            </div>

            <div className="bg-black/40 rounded-lg p-3 flex items-center justify-between border border-gray-800 ml-2">
               <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 font-bold uppercase">Início</span>
                  <span className="text-white font-bold text-lg">{formatTime(item.startTime)}</span>
               </div>
               
               <ArrowRight size={16} className="text-gray-600" />
               
               <div className="flex flex-col items-center">
                  <span className="text-xs text-orange-600/70 font-bold uppercase">Término</span>
                  <span className="text-orange-500 font-bold text-lg">{formatTime(item.endTime)}</span>
               </div>
            </div>
            
            {/* Mini Stats Footer */}
            <div className="flex gap-4 mt-4 pl-2 text-xs text-gray-500 border-t border-gray-800 pt-3">
               <span>Setup: {item.setupCount}</span>
               <span>Pallets: {item.palletChanges}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductionTable;
