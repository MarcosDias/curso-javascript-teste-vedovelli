import { fireEvent, render, screen } from '@testing-library/react';
import CartItem from './cart-item';

const product = {
  title: 'Super Smartwatch',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80',
};

const renderCartItem = () => render(<CartItem product={product} />);

describe('Cart Item', () => {
  it('should render Cart Item', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderCartItem();

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveProperty('src', product.image);
  });

  it('should display 1 as initial quantity', () => {
    renderCartItem();

    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should increase quantity by 1 when second button is clicked', () => {
    renderCartItem();

    const [_, btn] = screen.getAllByRole('button');

    fireEvent.click(btn);

    expect(screen.getByTestId('quantity').textContent).toBe('2');
  });
  it('should decrease quantity by 1 when first button is clicked', () => {
    renderCartItem();

    const [btnDecrease, btnIncrease] = screen.getAllByRole('button');
    const quantity = screen.getByTestId('quantity');

    fireEvent.click(btnIncrease);
    expect(quantity.textContent).toBe('2');

    fireEvent.click(btnDecrease);
    expect(quantity.textContent).toBe('1');
  });

  it('should not go below zero in the quantity', () => {
    renderCartItem();

    const [btnDecrease] = screen.getAllByRole('button');
    const quantity = screen.getByTestId('quantity');

    expect(quantity.textContent).toBe('1');

    fireEvent.click(btnDecrease);
    fireEvent.click(btnDecrease);

    expect(quantity.textContent).toBe('0');
  });
});
