import React, { useState } from 'react';
import { Plus, Trash2, Wand2, RefreshCw, Mail } from 'lucide-react';
import { QuoteData, LineItem, BusinessDetails, ClientDetails } from '../types';
import { CURRENCIES } from '../constants';
import { enhanceDescription, generateTerms, generateEmailDraft } from '../services/geminiService';

interface QuoteEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export const QuoteEditor: React.FC<QuoteEditorProps> = ({ data, onChange }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);

  const updateField = (field: keyof QuoteData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateBusiness = (field: keyof BusinessDetails, value: string) => {
    onChange({ ...data, business: { ...data.business, [field]: value } });
  };

  const updateClient = (field: keyof ClientDetails, value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: 'New Item',
      quantity: 1,
      unitPrice: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(i => i.id !== id) });
  };

  // AI Handlers
  const handleEnhanceItem = async (id: string, text: string) => {
    if (!text) return;
    setLoadingAI(`item-${id}`);
    const enhanced = await enhanceDescription(text);
    if (enhanced) updateItem(id, 'description', enhanced);
    setLoadingAI(null);
  };

  const handleGenerateTerms = async () => {
    const businessType = prompt("What is your business type/industry? (e.g., 'Web Design', 'Plumbing')");
    if (!businessType) return;
    
    setLoadingAI('terms');
    const terms = await generateTerms(businessType);
    if (terms) updateField('terms', terms);
    setLoadingAI(null);
  };

  const handleGenerateEmail = async () => {
    setLoadingAI('email');
    const total = data.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0) + (data.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0) * (data.taxRate / 100));
    const formattedTotal = `${data.currency}${total.toFixed(2)}`;
    
    const email = await generateEmailDraft(data.client.name, formattedTotal, data.business.name);
    setGeneratedEmail(email);
    setLoadingAI(null);
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Configuration Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quote #</label>
            <input 
              type="text" 
              value={data.id} 
              onChange={(e) => updateField('id', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
            <select 
              value={data.currency} 
              onChange={(e) => updateField('currency', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none transition"
            >
              {CURRENCIES.map(c => <option key={c.code} value={c.symbol}>{c.code} ({c.symbol})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input 
              type="date" 
              value={data.date} 
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input 
              type="date" 
              value={data.dueDate} 
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
          </div>
        </div>
      </section>

      {/* Business Info */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Your Business</h2>
        <div className="space-y-3">
          <input 
            placeholder="Business Name"
            value={data.business.name}
            onChange={(e) => updateBusiness('name', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <input 
            placeholder="Address"
            value={data.business.address}
            onChange={(e) => updateBusiness('address', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              placeholder="Email"
              value={data.business.email}
              onChange={(e) => updateBusiness('email', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <input 
              placeholder="Phone"
              value={data.business.phone}
              onChange={(e) => updateBusiness('phone', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Client</h2>
        <div className="space-y-3">
          <input 
            placeholder="Client Name"
            value={data.client.name}
            onChange={(e) => updateClient('name', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <input 
            placeholder="Company Name"
            value={data.client.company}
            onChange={(e) => updateClient('company', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <input 
            placeholder="Email Address"
            value={data.client.email}
            onChange={(e) => updateClient('email', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <textarea 
            placeholder="Billing Address"
            value={data.client.address}
            onChange={(e) => updateClient('address', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none h-20 resize-none"
          />
        </div>
      </section>

      {/* Items */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-slate-800">Line Items</h2>
          <button onClick={addItem} className="flex items-center text-sm text-brand-600 hover:text-brand-700 font-medium transition">
            <Plus size={16} className="mr-1" /> Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="group relative bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-brand-200 transition">
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-12 md:col-span-7">
                   <div className="relative">
                     <textarea 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none min-h-[60px] resize-y pr-8"
                      />
                      <button 
                        onClick={() => handleEnhanceItem(item.id, item.description)}
                        disabled={loadingAI === `item-${item.id}`}
                        title="AI Rewrite"
                        className="absolute right-2 top-2 text-purple-500 hover:text-purple-700 transition disabled:opacity-50"
                      >
                        {loadingAI === `item-${item.id}` ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                      </button>
                   </div>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded text-center"
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input 
                    type="number" 
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded text-right"
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-4 md:col-span-1 flex justify-center pt-2">
                   <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end items-center gap-4">
           <label className="text-sm font-medium text-slate-700">Tax Rate (%)</label>
           <input 
             type="number" 
             value={data.taxRate}
             onChange={(e) => updateField('taxRate', parseFloat(e.target.value))}
             className="w-20 p-2 border border-slate-300 rounded text-right"
           />
        </div>
      </section>

      {/* AI Tools & Footer */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-purple-100">
        <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Wand2 size={20} /> AI Tools
        </h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleGenerateTerms}
            disabled={loadingAI === 'terms'}
            className="flex items-center px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition shadow-sm disabled:opacity-50"
          >
            {loadingAI === 'terms' ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Wand2 size={16} className="mr-2" />}
            Generate Terms
          </button>
          
          <button 
            onClick={handleGenerateEmail}
            disabled={loadingAI === 'email'}
            className="flex items-center px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition shadow-sm disabled:opacity-50"
          >
             {loadingAI === 'email' ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Mail size={16} className="mr-2" />}
            Draft Email
          </button>
        </div>

        {generatedEmail && (
          <div className="mt-4 bg-white p-4 rounded border border-purple-100 animate-fadeIn">
            <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Generated Email Draft</h4>
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">{generatedEmail}</pre>
            <button 
              onClick={() => { navigator.clipboard.writeText(generatedEmail); setGeneratedEmail(null); }}
              className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Copy & Close
            </button>
          </div>
        )}
      </section>
      
      <div className="text-xs text-slate-400 text-center pb-8">
        AI features powered by Google Gemini
      </div>
    </div>
  );
};