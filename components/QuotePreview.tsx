import React from 'react';
import { QuoteData } from '../types';

interface QuotePreviewProps {
  data: QuoteData;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (data.taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] mx-auto p-8 md:p-12 text-slate-800 relative text-sm md:text-base print:w-full print:max-w-none print:p-0">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">QUOTATION</h1>
          <p className="text-slate-500 font-medium">#{data.id}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-xl text-slate-900">{data.business.name}</h2>
          <div className="text-slate-500 text-sm mt-1 whitespace-pre-line">
            {data.business.address}
            <br />
            {data.business.email}
            <br />
            {data.business.phone}
            {data.business.website && <><br />{data.business.website}</>}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="flex justify-between mb-12 border-b pb-8 border-slate-100">
        <div className="w-1/2 pr-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
          <div className="font-medium text-slate-900 text-lg">{data.client.name || 'Client Name'}</div>
          {data.client.company && <div className="text-slate-700">{data.client.company}</div>}
          <div className="text-slate-500 mt-1 whitespace-pre-line">{data.client.address}</div>
          <div className="text-slate-500">{data.client.email}</div>
        </div>
        <div className="w-1/3 text-right">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</h3>
            <div className="font-medium text-slate-900">{data.date}</div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Until</h3>
            <div className="font-medium text-slate-900">{data.dueDate}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mb-8 collapse">
        <thead>
          <tr className="border-b-2 border-slate-900">
            <th className="text-left py-3 font-bold text-slate-900 w-1/2">Description</th>
            <th className="text-center py-3 font-bold text-slate-900 w-1/6">Qty</th>
            <th className="text-right py-3 font-bold text-slate-900 w-1/6">Price</th>
            <th className="text-right py-3 font-bold text-slate-900 w-1/6">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-4 text-slate-700 pr-4">
                <p className="font-medium text-slate-900">{item.description}</p>
              </td>
              <td className="py-4 text-center text-slate-600">{item.quantity}</td>
              <td className="py-4 text-right text-slate-600">
                {data.currency}{item.unitPrice.toFixed(2)}
              </td>
              <td className="py-4 text-right font-medium text-slate-900">
                {data.currency}{(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2 md:w-1/3">
          <div className="flex justify-between py-2 text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">{data.currency}{subtotal.toFixed(2)}</span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between py-2 text-slate-600">
              <span>Tax ({data.taxRate}%)</span>
              <span className="font-medium">{data.currency}{taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 border-t-2 border-slate-900 text-xl font-bold text-slate-900 mt-2">
            <span>Total</span>
            <span>{data.currency}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="grid grid-cols-1 gap-8">
        {data.notes && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-slate-600 text-sm">{data.notes}</p>
          </div>
        )}
        {data.terms && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions</h3>
            <p className="text-slate-600 text-sm whitespace-pre-line">{data.terms}</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center text-slate-300 text-xs print:hidden">
        Generated with QuoteGenius AI
      </div>
    </div>
  );
};