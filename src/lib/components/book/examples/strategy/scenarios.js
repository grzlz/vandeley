export const scenarios = [
  {
    id: 'creditcard',
    label: 'Credit Card',
    emoji: '💳',
    storyline: 'Standard credit card payment with fraud detection and 3D Secure.',
    payment: {
      amount: 149.99,
      currency: 'USD',
      method: 'credit_card',
      requiresAuth: true,
      processingFee: 2.9,
      riskScore: 'low',
      instantSettlement: false
    }
  },
  {
    id: 'paypal',
    label: 'PayPal',
    emoji: '🔵',
    storyline: 'Express checkout via PayPal with buyer protection and instant transfer.',
    payment: {
      amount: 89.50,
      currency: 'USD',
      method: 'paypal',
      requiresAuth: false,
      processingFee: 3.5,
      riskScore: 'minimal',
      instantSettlement: true
    }
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    emoji: '₿',
    storyline: 'Bitcoin payment with blockchain confirmation and volatile exchange rates.',
    payment: {
      amount: 0.00425,
      currency: 'BTC',
      method: 'crypto',
      requiresAuth: false,
      processingFee: 0.5,
      riskScore: 'medium',
      instantSettlement: false
    }
  }
];

export const paymentThemes = {
  creditcard: 'from-blue-500 via-indigo-400 to-purple-300 text-slate-900',
  paypal: 'from-blue-600 via-cyan-400 to-teal-300 text-slate-900',
  crypto: 'from-orange-500 via-amber-400 to-yellow-300 text-slate-900',
  default: 'from-slate-800 via-slate-700 to-slate-600 text-white'
};