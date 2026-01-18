import React, { useState } from 'react';
import { QuoteEditor } from './components/QuoteEditor';
import { QuotePreview } from './components/QuotePreview';
import { DEFAULT_QUOTE } from './constants';
import { QuoteData } from './types';
import { Printer, Download, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [quoteData, setQuoteData] = useState<QuoteData>(DEFAULT_QUOTE);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 text-white shadow-lg no-print sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">QuoteGenius AI</span>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Side (Left) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 no-print overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          <div className="mb-4">
             <h1 className="text-2xl font-bold text-slate-800">Create Quotation</h1>
             <p className="text-slate-500 text-sm">Fill in the details below. Use AI to enhance your content.</p>
          </div>
          <QuoteEditor data={quoteData} onChange={setQuoteData} />
        </div>

        {/* Preview Side (Right) */}
        <div className="lg:col-span-7 xl:col-span-8 flex justify-center bg-slate-200/50 rounded-2xl p-4 md:p-8 border border-slate-200 overflow-y-auto print:border-none print:bg-white print:p-0 print:block print:w-full">
           <QuotePreview data={quoteData} />
        </div>

      </main>
      
      {/* Mobile Print Fab */}
      <button 
        onClick={handlePrint}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center lg:hidden z-50 no-print hover:bg-brand-500 transition"
      >
        <Printer size={24} />
      </button>

      {/* Styles for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default App;