import { DEFAULT_QUOTE, CURRENCIES } from './constants.js';
import { enhanceDescription, generateTerms, generateEmailDraft } from './services/geminiService.js';

// --- State Management ---
let state = JSON.parse(JSON.stringify(DEFAULT_QUOTE));
let loadingState = {
  active: null, // 'item-ID', 'terms', 'email'
};

// --- DOM Elements ---
const elements = {
  previewContainer: document.getElementById('preview-container'),
  itemsListContainer: document.getElementById('items-list-container'),
  selectCurrency: document.getElementById('select-currency'),
  emailContainer: document.getElementById('email-result-container'),
  emailOutput: document.getElementById('email-output'),
};

// --- Initialization ---
function init() {
  // Populate Currency Selector
  elements.selectCurrency.innerHTML = CURRENCIES.map(c => 
    `<option value="${c.symbol}">${c.code} (${c.symbol})</option>`
  ).join('');

  // Bind Initial Values to Static Inputs
  bindStaticValues();

  // Initial Render
  renderItemsList();
  renderPreview();
  lucide.createIcons();

  // Global Event Listeners
  setupEventListeners();
}

// --- Rendering ---

function renderPreview() {
  const subtotal = state.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (state.taxRate / 100);
  const total = subtotal + taxAmount;

  const html = `
    <div class="bg-white shadow-2xl print:shadow-none w-full min-h-[297mm] mx-auto p-8 md:p-12 text-slate-800 relative text-sm md:text-base print:w-full print:p-0">
      
      <!-- Header -->
      <div class="flex justify-between items-start mb-12">
        <div>
          <h1 class="text-4xl font-bold text-slate-900 mb-2">QUOTATION</h1>
          <p class="text-slate-500 font-medium">#${state.id}</p>
        </div>
        <div class="text-right">
          <h2 class="font-bold text-xl text-slate-900">${state.business.name || 'Your Business'}</h2>
          <div class="text-slate-500 text-sm mt-1 whitespace-pre-line">
            ${state.business.address || ''}
            ${state.business.email ? `<br />${state.business.email}` : ''}
            ${state.business.phone ? `<br />${state.business.phone}` : ''}
            ${state.business.website ? `<br />${state.business.website}` : ''}
          </div>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="flex justify-between mb-12 border-b pb-8 border-slate-100">
        <div class="w-1/2 pr-4">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
          <div class="font-medium text-slate-900 text-lg">${state.client.name || 'Client Name'}</div>
          ${state.client.company ? `<div class="text-slate-700">${state.client.company}</div>` : ''}
          <div class="text-slate-500 mt-1 whitespace-pre-line">${state.client.address || ''}</div>
          <div class="text-slate-500">${state.client.email || ''}</div>
        </div>
        <div class="w-1/3 text-right">
          <div class="mb-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</h3>
            <div class="font-medium text-slate-900">${state.date}</div>
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Until</h3>
            <div class="font-medium text-slate-900">${state.dueDate}</div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <table class="w-full mb-8 collapse">
        <thead>
          <tr class="border-b-2 border-slate-900">
            <th class="text-left py-3 font-bold text-slate-900 w-1/2">Description</th>
            <th class="text-center py-3 font-bold text-slate-900 w-1/6">Qty</th>
            <th class="text-right py-3 font-bold text-slate-900 w-1/6">Price</th>
            <th class="text-right py-3 font-bold text-slate-900 w-1/6">Total</th>
          </tr>
        </thead>
        <tbody>
          ${state.items.map(item => `
            <tr class="border-b border-slate-100">
              <td class="py-4 text-slate-700 pr-4">
                <p class="font-medium text-slate-900">${item.description}</p>
              </td>
              <td class="py-4 text-center text-slate-600">${item.quantity}</td>
              <td class="py-4 text-right text-slate-600">
                ${state.currency}${Number(item.unitPrice).toFixed(2)}
              </td>
              <td class="py-4 text-right font-medium text-slate-900">
                ${state.currency}${(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="flex justify-end mb-12">
        <div class="w-1/2 md:w-1/3">
          <div class="flex justify-between py-2 text-slate-600">
            <span>Subtotal</span>
            <span class="font-medium">${state.currency}${subtotal.toFixed(2)}</span>
          </div>
          ${state.taxRate > 0 ? `
            <div class="flex justify-between py-2 text-slate-600">
              <span>Tax (${state.taxRate}%)</span>
              <span class="font-medium">${state.currency}${taxAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="flex justify-between py-4 border-t-2 border-slate-900 text-xl font-bold text-slate-900 mt-2">
            <span>Total</span>
            <span>${state.currency}${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div class="grid grid-cols-1 gap-8">
        ${state.notes ? `
          <div>
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
            <p class="text-slate-600 text-sm">${state.notes}</p>
          </div>
        ` : ''}
        ${state.terms ? `
          <div>
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions</h3>
            <p class="text-slate-600 text-sm whitespace-pre-line">${state.terms}</p>
          </div>
        ` : ''}
      </div>
      
      <div class="absolute bottom-8 left-0 w-full text-center text-slate-300 text-xs print:hidden">
        Generated with QuoteGenius AI
      </div>
    </div>
  `;
  elements.previewContainer.innerHTML = html;
}

function renderItemsList() {
  elements.itemsListContainer.innerHTML = state.items.map(item => `
    <div class="group relative bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-brand-200 transition" data-id="${item.id}">
      <div class="grid grid-cols-12 gap-3 items-start">
        <div class="col-span-12 md:col-span-7">
           <div class="relative">
             <textarea 
                data-item-field="description"
                placeholder="Description"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none min-h-[60px] resize-y pr-8"
              >${item.description}</textarea>
              <button 
                class="btn-enhance absolute right-2 top-2 text-purple-500 hover:text-purple-700 transition disabled:opacity-50"
                title="AI Rewrite"
                ${loadingState.active === `item-${item.id}` ? 'disabled' : ''}
              >
                ${loadingState.active === `item-${item.id}` 
                  ? '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i>' 
                  : '<i data-lucide="wand-2" class="w-3 h-3"></i>'}
              </button>
           </div>
        </div>
        <div class="col-span-4 md:col-span-2">
          <input 
            type="number" 
            data-item-field="quantity"
            value="${item.quantity}"
            class="w-full p-2 border border-slate-300 rounded text-center"
            placeholder="Qty"
          />
        </div>
        <div class="col-span-4 md:col-span-2">
          <input 
            type="number" 
            data-item-field="unitPrice"
            value="${item.unitPrice}"
            class="w-full p-2 border border-slate-300 rounded text-right"
            placeholder="Price"
          />
        </div>
        <div class="col-span-4 md:col-span-1 flex justify-center pt-2">
           <button 
            class="btn-remove-item text-red-400 hover:text-red-600 transition"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

// --- Logic & Helpers ---

function bindStaticValues() {
  // Finds all static inputs with data-model and sets their value from state
  document.querySelectorAll('[data-model]').forEach(el => {
    const path = el.dataset.model;
    const value = getDeepValue(state, path);
    el.value = value;
  });
}

function getDeepValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function setDeepValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// --- Event Handlers ---

function setupEventListeners() {
  // 1. Static Inputs Change
  document.body.addEventListener('input', (e) => {
    if (e.target.matches('[data-model]')) {
      const path = e.target.dataset.model;
      setDeepValue(state, path, e.target.value);
      renderPreview();
    }
  });

  // 2. Line Items Change (Input)
  elements.itemsListContainer.addEventListener('input', (e) => {
    if (e.target.matches('[data-item-field]')) {
      const field = e.target.dataset.itemField;
      const id = e.target.closest('[data-id]').dataset.id;
      const item = state.items.find(i => i.id === id);
      
      if (item) {
        if (field === 'quantity' || field === 'unitPrice') {
           item[field] = parseFloat(e.target.value) || 0;
        } else {
           item[field] = e.target.value;
        }
        renderPreview();
      }
    }
  });

  // 3. Line Items Clicks (Remove / Enhance)
  elements.itemsListContainer.addEventListener('click', async (e) => {
    const btnRemove = e.target.closest('.btn-remove-item');
    const btnEnhance = e.target.closest('.btn-enhance');
    const row = e.target.closest('[data-id]');
    
    if (!row) return;
    const id = row.dataset.id;

    if (btnRemove) {
      state.items = state.items.filter(i => i.id !== id);
      renderItemsList();
      renderPreview();
    }

    if (btnEnhance) {
      const item = state.items.find(i => i.id === id);
      if (item && item.description && !loadingState.active) {
        setLoading(`item-${id}`);
        renderItemsList(); // re-render to show spinner
        
        try {
          const newDesc = await enhanceDescription(item.description);
          if (newDesc) {
             item.description = newDesc;
             // We need to re-render list to update textarea value and remove spinner
             renderItemsList();
             renderPreview();
          }
        } finally {
          setLoading(null);
          renderItemsList();
        }
      }
    }
  });

  // 4. Add Item
  document.getElementById('btn-add-item').addEventListener('click', () => {
    state.items.push({
      id: Date.now().toString(),
      description: 'New Item',
      quantity: 1,
      unitPrice: 0
    });
    renderItemsList();
    renderPreview();
  });

  // 5. Generate Terms
  document.getElementById('btn-generate-terms').addEventListener('click', async () => {
    const businessType = prompt("What is your business type/industry?");
    if (businessType && !loadingState.active) {
       // Show loading on button (manually for static buttons)
       const btn = document.getElementById('btn-generate-terms');
       const originalText = btn.innerHTML;
       btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i> Generating...`;
       lucide.createIcons();
       
       try {
         const terms = await generateTerms(businessType);
         if (terms) {
           state.terms = terms;
           document.querySelector('[data-model="terms"]').value = terms;
           renderPreview();
         }
       } finally {
         btn.innerHTML = originalText;
         lucide.createIcons();
       }
    }
  });

  // 6. Generate Email
  document.getElementById('btn-draft-email').addEventListener('click', async () => {
    if (loadingState.active) return;
    
    const btn = document.getElementById('btn-draft-email');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i> Drafting...`;
    lucide.createIcons();

    const total = state.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0) * (1 + state.taxRate/100);
    const formattedTotal = `${state.currency}${total.toFixed(2)}`;

    try {
      const email = await generateEmailDraft(state.client.name, formattedTotal, state.business.name);
      if (email) {
        elements.emailOutput.innerText = email;
        elements.emailContainer.classList.remove('hidden');
      }
    } finally {
      btn.innerHTML = originalText;
      lucide.createIcons();
    }
  });

  // 7. Copy Email
  document.getElementById('btn-copy-email').addEventListener('click', () => {
    navigator.clipboard.writeText(elements.emailOutput.innerText);
    elements.emailContainer.classList.add('hidden');
  });

  // 8. Print
  const printAction = () => window.print();
  document.getElementById('btn-print').addEventListener('click', printAction);
  document.getElementById('btn-print-mobile').addEventListener('click', printAction);
}

function setLoading(what) {
  loadingState.active = what;
}

// Start
init();