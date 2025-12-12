
import React, { useState, useEffect } from 'react';
import { ProductionInput, ProductionItem } from './types';
import { calculateProduction } from './utils/calculations';
import ProductionForm from './components/ProductionForm';
import ProductionTable from './components/ProductionTable';
import SummaryCards from './components/SummaryCards';
import { LayoutDashboard, Plus, X, Loader2, Save } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProductionItem | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('productionItems');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Erro ao carregar dados locais", e);
      }
    }
    setLoading(false);
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('productionItems', JSON.stringify(items));
    }
  }, [items, loading]);

  const handleSaveItem = (input: ProductionInput) => {
    const calculated = calculateProduction(input);

    setItems(prev => {
      let updatedList;
      
      if (editingItem) {
        // If editing, preserve the ID
        const updatedItem = { ...calculated, id: editingItem.id };
        updatedList = prev.map(item => item.id === editingItem.id ? updatedItem : item);
      } else {
        // If adding new
        updatedList = [...prev, calculated];
      }

      // Sort by start time locally
      return updatedList.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });
    
    closeModal();
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleEditItem = (item: ProductionItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null); // Reset editing state
  }

  const getSuggestedStartTime = (): string => {
    if (editingItem) return ''; // No suggestion when editing
    if (items.length === 0) return '';
    const lastItem = items[items.length - 1]; 
    if (!lastItem) return '';

    const date = new Date(lastItem.endTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-850 text-white p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row items-center md:justify-between border-b border-gray-800 pb-6 gap-6 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="bg-orange-600 p-3 rounded-xl shadow-lg shadow-orange-900/20">
                    <LayoutDashboard className="text-white" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Planejamento de Produção</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                      <p className="text-gray-400 font-medium text-base md:text-lg">Gerenciamento de Ordens</p>
                    </div>
                </div>
            </div>
            
            <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="w-full md:w-auto bg-white hover:bg-gray-200 text-black font-extrabold py-3 md:py-4 px-8 rounded-lg flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-xl uppercase tracking-wide"
            >
                <Plus size={24} className="text-orange-600" strokeWidth={3} />
                Nova Ordem
            </button>
        </header>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
              <p className="text-gray-400">Carregando dados...</p>
           </div>
        ) : (
          <>
            <SummaryCards items={items} />

            <div className="w-full space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-6 md:h-8 bg-orange-600 rounded-full inline-block"></span>
                        Resumo de Produção
                    </h2>
                    <span className="bg-gray-900 border border-gray-800 text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 rounded-full text-gray-300">
                        {items.length} {items.length === 1 ? 'ORDEM' : 'ORDENS'}
                    </span>
                </div>
                <ProductionTable 
                  items={items} 
                  onRemove={handleRemoveItem} 
                  onEdit={handleEditItem}
                />
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-hidden">
            <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
              
              <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center bg-black/40 shrink-0">
                <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide flex items-center gap-3">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    {editingItem ? 'Editar Ordem' : 'Nova Ordem de Produção'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
                >
                  <X size={28} />
                </button>
              </div>
              
              <div className="p-4 md:p-8 bg-gray-900 overflow-y-auto custom-scrollbar">
                <ProductionForm 
                  onAdd={handleSaveItem} 
                  onCancel={closeModal} 
                  suggestedStartTime={getSuggestedStartTime()}
                  initialData={editingItem}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
