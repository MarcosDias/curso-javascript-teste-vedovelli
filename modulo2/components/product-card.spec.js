import { fireEvent, render, screen } from '@testing-library/react';
import ProductCard from './product-card';

const product = {
  title: 'Super Smartwatch',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

const addToCart = jest.fn();

const renderProductCart = () => render(<ProductCard product={product} addToCart={addToCart} />);

describe('Product Card', () => {
  it('should render Product Card', () => {
    renderProductCart();

    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderProductCart();

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('should call props.addToCart() when button gets clicked', () => {
    renderProductCart();

    const btn = screen.getByRole('button');

    fireEvent.click(btn);

    expect(addToCart).toHaveBeenCalled();
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
