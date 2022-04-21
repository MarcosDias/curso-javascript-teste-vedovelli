import { renderHook, act } from '@testing-library/react-hooks';
import { makeServer } from '../../miragejs/server';
import { useCartStore } from './';

describe('Cart Store', () => {
  let server;
  let cartStore;
  let add;
  let toggle;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    cartStore = renderHook(() => useCartStore()).result;
    add = cartStore.current.actions.add;
    toggle = cartStore.current.actions.toggle;
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

  it('should add 2 products to the list', async () => {
    const products = server.createList('product', 2);

    for (const product of products) {
      act(() => add(product));
    }

    expect(cartStore.current.state.products).toHaveLength(2);
  });

  it('should not add same product twice', () => {
    const product = server.create('product');

    act(() => add(product));
    act(() => add(product));

    expect(cartStore.current.state.products).toHaveLength(1);
  });
});
