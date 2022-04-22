import { renderHook, act } from '@testing-library/react-hooks';
import { makeServer } from '../../miragejs/server';
import { useCartStore } from './';

describe('Cart Store', () => {
  let server;
  let cartStore;
  let add;
  let toggle;
  let remove;
  let removeAll;
  let increase;
  let decrease;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    cartStore = renderHook(() => useCartStore()).result;
    add = cartStore.current.actions.add;
    toggle = cartStore.current.actions.toggle;
    remove = cartStore.current.actions.remove;
    removeAll = cartStore.current.actions.removeAll;
    increase = cartStore.current.actions.increase;
    decrease = cartStore.current.actions.decrease;
  });

  afterEach(() => {
    server.shutdown();
    act(() => cartStore.current.actions.reset());
  });

  it('should return open equals false on initial state', async () => {
    expect(cartStore.current.state.open).toBe(false);
  });

  it('should toggle open state', async () => {
    expect(cartStore.current.state.open).toBe(false);
    expect(cartStore.current.state.products).toHaveLength(0);

    act(toggle);
    expect(cartStore.current.state.open).toBe(true);

    act(toggle);
    expect(cartStore.current.state.open).toBe(false);
    expect(cartStore.current.state.products).toHaveLength(0);
  });

  it('should return an empty array for products on initial state', () => {
    expect(Array.isArray(cartStore.current.state.products)).toBe(true);
    expect(cartStore.current.state.products).toHaveLength(0);
  });

  it('should add 2 products to the list and open the cart', async () => {
    const products = server.createList('product', 2);

    for (const product of products) {
      act(() => add(product));
    }

    expect(cartStore.current.state.products).toHaveLength(2);
    expect(cartStore.current.state.open).toBe(true);
  });

  it('should not add same product twice', () => {
    const product = server.create('product');

    act(() => add(product));
    act(() => add(product));

    expect(cartStore.current.state.products).toHaveLength(1);
  });

  it('should assign 1 as initial quantity on product add()', () => {
    const product = server.create('product');

    act(() => {
      add(product);
    });

    expect(cartStore.current.state.products[0].quantity).toBe(1);
  });

  it('should increase quantity', () => {
    const product = server.create('product');

    act(() => {
      add(product);
      increase(product);
    });

    expect(cartStore.current.state.products[0].quantity).toBe(2);
  });

  it('should increase quantity', () => {
    const product = server.create('product');

    act(() => {
      add(product);
      decrease(product);
    });

    expect(cartStore.current.state.products[0].quantity).toBe(0);
  });

  it('should NOT decrease below zero', () => {
    const product = server.create('product');

    act(() => {
      add(product);
      decrease(product);
      decrease(product);
    });

    expect(cartStore.current.state.products[0].quantity).toBe(0);
  });

  it('should remove a product from the store', () => {
    const [product1, product2] = server.createList('product', 2);

    act(() => {
      add(product1);
      add(product2);
    });

    expect(cartStore.current.state.products).toHaveLength(2);

    act(() => {
      remove(product1);
    });

    expect(cartStore.current.state.products).toHaveLength(1);
    expect(cartStore.current.state.products[0]).toEqual(product2);
  });

  it('should not change products in the cart if provided product is not in the array', () => {
    const [product1, product2, product3] = server.createList('product', 3);

    act(() => {
      add(product1);
      add(product2);
    });

    expect(cartStore.current.state.products).toHaveLength(2);

    act(() => {
      remove(product3);
    });

    expect(cartStore.current.state.products).toHaveLength(2);
  });

  it('should clear cart', () => {
    const products = server.createList('product', 2);

    act(() => {
      for (const product of products) {
        add(product);
      }
    });

    expect(cartStore.current.state.products).toHaveLength(2);

    act(() => {
      removeAll();
    });

    expect(cartStore.current.state.products).toHaveLength(0);
  });
});
