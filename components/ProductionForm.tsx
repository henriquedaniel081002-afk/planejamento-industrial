
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Search, Save, X } from 'lucide-react';
import { ProductionInput, ProductionItem } from '../types';
import { getProductDescription, searchProducts } from '../utils/products';

interface ProductionFormProps {
  onAdd: (input: ProductionInput) => void;
  onCancel: () => void;
  suggestedStartTime?: string;
  initialData?: ProductionItem | null;
}

// Local state interface to allow empty strings for inputs
interface FormState {
  code: string;
  product: string;
  startTime: string;
  speed: string;
  simultaneousCoils: string;
  avgLength: string;
  totalCoils: string;
  plannedQuantity: string;
  palletChanges: string;
}

const ProductionForm: React.FC<ProductionFormProps> = ({ onAdd, onCancel, suggestedStartTime = '', initialData }) => {
  
  // Helper to init state safely
  const getInitialState = (): FormState => {
    if (initialData) {
      return {
        code: '', // We don't store the code in the item, so we leave it empty or could try to reverse lookup
        product: initialData.product,
        startTime: initialData.startTime ? new Date(initialData.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
        speed: initialData.speed > 0 ? String(initialData.speed) : '',
        simultaneousCoils: initialData.simultaneousCoils > 0 ? String(initialData.simultaneousCoils) : '',
        avgLength: initialData.avgLength > 0 ? String(initialData.avgLength) : '',
        totalCoils: initialData.totalCoils > 0 ? String(initialData.totalCoils) : '',
        plannedQuantity: initialData.plannedQuantity > 0 ? String(initialData.plannedQuantity) : '',
        palletChanges: initialData.palletChanges > 0 ? String(initialData.palletChanges) : '',
      };
    }
    return {
      code: '',
      product: '',
      startTime: suggestedStartTime,
      speed: '',
      simultaneousCoils: '',
      avgLength: '',
      totalCoils: '',
      plannedQuantity: '',
      palletChanges: '',
    };
  };

  const [formData, setFormData] = useState<FormState>(getInitialState);
  const [suggestions, setSuggestions] = useState<Array<{ code: string; description: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update form if initialData changes (e.g. reopening modal)
  useEffect(() => {
    setFormData(getInitialState());
  }, [initialData, suggestedStartTime]);

  // Click outside listener for suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'product') {
      const results = searchProducts(value);
      setSuggestions(results);
      setShowSuggestions(true);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCodeBlur = () => {
    if (formData.code) {
      const description = getProductDescription(formData.code);
      if (description) {
        setFormData(prev => ({
          ...prev,
          product: description
        }));
      }
    }
  };

  const selectSuggestion = (suggestion: { code: string; description: string }) => {
    setFormData(prev => ({
      ...prev,
      code: suggestion.code,
      product: suggestion.description
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) {
      alert("Por favor preencha o código do produto.");
      return;
    }

    // Convert strings to numbers for the parent component
    const submissionData: ProductionInput = {
      product: formData.product || 'Produto Sem Descrição',
      startTime: formData.startTime,
      speed: Number(formData.speed) || 0,
      simultaneousCoils: Number(formData.simultaneousCoils) || 0,
      avgLength: Number(formData.avgLength) || 0,
      totalCoils: Number(formData.totalCoils) || 0,
      plannedQuantity: Number(formData.plannedQuantity) || 0,
      palletChanges: Number(formData.palletChanges) || 0,
    };

    onAdd(submissionData);
    
    // Form is reset via parent closing modal or unmounting, 
    // but if we were to stay open:
    if (!initialData) {
        setFormData({
            code: '',
            product: '',
            startTime: '',
            speed: '',
            simultaneousCoils: '',
            avgLength: '',
            totalCoils: '',
            plannedQuantity: '',
            palletChanges: '',
        });
    }
  };

  // Helper for live calculations in the preview box
  const getNumericVal = (val: string) => Number(val) || 0;

  const totalCoilsVal = getNumericVal(formData.totalCoils);
  const simultaneousVal = getNumericVal(formData.simultaneousCoils);
  const palletChangesVal = getNumericVal(formData.palletChanges);
  
  // Calculate preview values safely
  const calculatedSetupTime = simultaneousVal > 0 
    ? Math.ceil(totalCoilsVal / simultaneousVal) * 10 
    : 0;
  
  const calculatedPalletTime = palletChangesVal * 3;

  const inputClass = "w-full bg-white border border-gray-300 rounded p-3 text-black font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm placeholder-gray-400";
  const labelClass = "block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <label className={labelClass}>Cód. Produto *</label>
          <div className="relative">
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              onBlur={handleCodeBlur}
              className={`${inputClass} pr-10`}
              placeholder="Ex: 1001"
              autoComplete="off"
              required
            />
            <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
              <Search size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Busca automática ao sair</p>
        </div>

        <div className="col-span-1 md:col-span-3 relative" ref={suggestionsRef}>
          <label className={labelClass}>Produto (Descrição)</label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            onFocus={() => {
               if(formData.product.length >= 2) {
                   setSuggestions(searchProducts(formData.product));
                   setShowSuggestions(true);
               }
            }}
            className={inputClass}
            placeholder="Pesquise pela descrição..."
            autoComplete="off"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item.code}
                  className="p-3 hover:bg-orange-600 hover:text-white cursor-pointer text-gray-300 transition-colors text-sm border-b border-gray-700 last:border-0"
                  onClick={() => selectSuggestion(item)}
                >
                  <span className="font-bold mr-2">{item.code}</span>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Horário Início</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className={`${inputClass} [&::-webkit-calendar-picker-indicator]:opacity-100`}
        />
      </div>

      <div>
        <label className={labelClass}>Qtde Planejada</label>
        <input
          type="number"
          name="plannedQuantity"
          value={formData.plannedQuantity}
          onChange={handleChange}
          min="0"
          placeholder="Ex: 5000"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Velocidade (m/min)</label>
        <input
          type="number"
          name="speed"
          value={formData.speed}
          onChange={handleChange}
          min="0"
          placeholder="Ex: 150"
          className={inputClass}
        />
      </div>

      <div>
         <label className={labelClass}>Bobinas Simultâneas</label>
         <input
          type="number"
          name="simultaneousCoils"
          value={formData.simultaneousCoils}
          onChange={handleChange}
          min="0"
          placeholder="Ex: 2"
          className={inputClass}
        />
      </div>

       <div>
         <label className={labelClass}>Comprimento Médio (m)</label>
         <input
          type="number"
          name="avgLength"
          value={formData.avgLength}
          onChange={handleChange}
          min="0"
          placeholder="Ex: 2000"
          className={inputClass}
        />
      </div>

      <div>
         <label className={labelClass}>Total Bobinas</label>
         <input
          type="number"
          name="totalCoils"
          value={formData.totalCoils}
          onChange={handleChange}
          min="0"
          placeholder="Ex: 20"
          className={inputClass}
        />
      </div>

      <div>
         <label className={labelClass}>Trocas de Pallet</label>
         <input
          type="number"
          name="palletChanges"
          value={formData.palletChanges}
          onChange={handleChange}
          min="0"
          placeholder="Ex: 4"
          className={inputClass}
        />
      </div>
      
      {/* Calculated Preview */}
      <div className="col-span-1 md:col-span-2">
         <div className="text-sm font-medium text-gray-300 w-full bg-gray-950 p-4 rounded border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-2">
           <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Setup (Auto): <span className="text-white font-bold text-lg ml-1">{calculatedSetupTime}</span> min</span>
           <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Troca Pallet (Auto): <span className="text-white font-bold text-lg ml-1">{calculatedPalletTime}</span> min</span>
         </div>
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white font-bold py-3 px-6 rounded transition-colors uppercase tracking-wide text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded flex items-center gap-2 transition-colors shadow-lg shadow-orange-900/20 uppercase tracking-wide text-sm"
        >
          {initialData ? <Save size={20} /> : <PlusCircle size={20} />}
          {initialData ? 'Atualizar Ordem' : 'Salvar Ordem'}
        </button>
      </div>

    </form>
  );
};

export default ProductionForm;
