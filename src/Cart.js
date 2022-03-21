import Dinero from 'dinero.js';
import { find, remove } from 'lodash';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, item) => {
  if (item.condition?.percentage && item.quantity > item.condition.minimum) {
    return amount.percentage(item.condition.percentage);
  }
  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, item) => {
  const isEven = item.quantity % 2 === 0;
  if (item.condition?.quantity && item.quantity > item.condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

const calculateDiscount = (amount, quantity, condition) => {
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
export default class Cart {
  items = [];

  add(item) {
    const itemToFind = { product: item.product };
    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }
    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });
      let discount = Money({ amount: 0 });

      if (item.condition) {
        discount = calculateDiscount(amount, item.quantity, item.condition);
      }

      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  summary() {
    return {
      total: this.getTotal().getAmount(),
      items: this.items,
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return {
      total,
      items,
    };
  }
}
