export function computeNaivePayment(payment) {
  if (payment.method === 'credit_card' && payment.requiresAuth) {
    return {
      tone: 'creditcard',
      headline: 'Credit Card Processing',
      body: `Processing $${payment.amount} with 3D Secure verification. High security with ${payment.processingFee}% fee.`,
      action: 'Redirect to bank authentication'
    };
  }
  if (payment.method === 'paypal' && payment.instantSettlement) {
    return {
      tone: 'paypal',
      headline: 'PayPal Express',
      body: `Quick checkout for $${payment.amount}. Buyer protection included with instant transfer.`,
      action: 'Redirect to PayPal'
    };
  }
  if (payment.method === 'crypto' && payment.currency === 'BTC') {
    return {
      tone: 'crypto',
      headline: 'Bitcoin Payment',
      body: `Processing ${payment.amount} BTC payment. Blockchain confirmation required.`,
      action: 'Generate wallet address'
    };
  }
  return {
    tone: 'default',
    headline: 'Payment Processing',
    body: 'Standard payment processing with basic validation.',
    action: 'Process payment'
  };
}

export function computeBranchingPayment(payment) {
  const type = (() => {
    if (payment.method === 'credit_card') return 'creditcard';
    if (payment.method === 'paypal') return 'paypal';
    if (payment.method === 'crypto') return 'crypto';
    return 'default';
  })();

  switch (type) {
    case 'creditcard':
      return {
        tone: 'creditcard',
        headline: 'Credit Card Processing',
        body: `Secure payment processing with fraud detection. ${payment.processingFee}% processing fee applies.`,
        action: 'Validate card details'
      };
    case 'paypal':
      return {
        tone: 'paypal',
        headline: 'PayPal Checkout',
        body: `Express checkout with PayPal. ${payment.processingFee}% fee with buyer protection.`,
        action: 'Authorize with PayPal'
      };
    case 'crypto':
      return {
        tone: 'crypto',
        headline: 'Cryptocurrency Payment',
        body: `Blockchain payment processing. Network fees and confirmation times apply.`,
        action: 'Initiate blockchain transaction'
      };
    default:
      return {
        tone: 'default',
        headline: 'Standard Payment',
        body: 'Processing payment with default method.',
        action: 'Complete transaction'
      };
  }
}

export function computeConfigPayment(payment) {
  const configs = {
    creditcard: {
      tone: 'creditcard',
      headline: 'Credit Card Processing',
      message: ({ amount, processingFee }) =>
        `Processing $${amount} with ${processingFee}% fee. PCI compliant with fraud protection.`,
      action: 'Process with Stripe'
    },
    paypal: {
      tone: 'paypal',
      headline: 'PayPal Checkout',
      message: ({ amount, processingFee }) =>
        `$${amount} via PayPal Express. ${processingFee}% fee with instant settlement.`,
      action: 'Redirect to PayPal'
    },
    crypto: {
      tone: 'crypto',
      headline: 'Cryptocurrency Payment',
      message: ({ amount, currency }) =>
        `${amount} ${currency} payment. Blockchain confirmation required for settlement.`,
      action: 'Generate payment address'
    },
    default: {
      tone: 'default',
      headline: 'Payment Processing',
      message: () => 'Standard payment processing with basic validation and security checks.',
      action: 'Process payment'
    }
  };

  const type = (() => {
    if (payment.method === 'credit_card') return 'creditcard';
    if (payment.method === 'paypal') return 'paypal';
    if (payment.method === 'crypto') return 'crypto';
    return 'default';
  })();

  const config = configs[type] ?? configs.default;
  return {
    tone: config.tone,
    headline: config.headline,
    body: config.message(payment),
    action: config.action
  };
}

export function computeStrategyPayment(payment) {
  const strategyRegistry = [
    {
      id: 'creditcard',
      matches: (data) => data.method === 'credit_card',
      resolve: (data) => ({
        tone: 'creditcard',
        headline: 'Credit Card Processing',
        body: `$${data.amount} ${data.currency} with ${data.processingFee}% processing fee. ${data.requiresAuth ? 'Enhanced security' : 'Standard validation'} enabled.`,
        action: data.requiresAuth ? 'Authenticate with 3D Secure' : 'Process payment'
      })
    },
    {
      id: 'paypal',
      matches: (data) => data.method === 'paypal',
      resolve: (data) => ({
        tone: 'paypal',
        headline: 'PayPal Express Checkout',
        body: `$${data.amount} ${data.currency} via PayPal. ${data.instantSettlement ? 'Instant settlement' : 'Standard processing'} with buyer protection.`,
        action: 'Authorize with PayPal'
      })
    },
    {
      id: 'crypto',
      matches: (data) => data.method === 'crypto',
      resolve: (data) => ({
        tone: 'crypto',
        headline: 'Cryptocurrency Payment',
        body: `${data.amount} ${data.currency} blockchain payment. Network confirmation required, ${data.processingFee}% processing fee.`,
        action: 'Generate wallet address'
      })
    }
  ];

  const fallbackStrategy = {
    id: 'default',
    resolve: (data) => ({
      tone: 'default',
      headline: 'Payment Processing',
      body: `$${data.amount} ${data.currency} using standard payment gateway with basic fraud protection.`,
      action: 'Process standard payment'
    })
  };

  const chosen = strategyRegistry.find((strategy) => strategy.matches?.(payment)) ?? fallbackStrategy;
  return chosen.resolve(payment);
}

export const stageResolvers = {
  naive: computeNaivePayment,
  branching: computeBranchingPayment,
  config: computeConfigPayment,
  strategy: computeStrategyPayment
};