import Dinero from 'dinero.js';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { quantity, condition }) => {
  if (condition?.percentage && quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, { quantity, condition }) => {
  const isEven = quantity % 2 === 0;
  if (condition?.quantity && quantity > condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

export const calculateDiscount = (amount, quantity, condition) => {
  const list = Array.isArray(condition) ? condition : [condition];

  const [higherDiscount] = list
    .map(conditionToApply => {
      if (conditionToApply.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: conditionToApply,
          quantity,
        }).getAmount();
      } else if (conditionToApply.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: conditionToApply,
          quantity,
        }).getAmount();
      }
    })
    .sort((a, b) => b - a);

  return Money({ amount: higherDiscount });
};
