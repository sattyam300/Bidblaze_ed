import React from 'react';

const ProductCard = ({ item }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={item.image?.imageUrl || '/placeholder.svg'} 
          alt={item.title}
          onError={(e) => {
            e.target.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{item.title}</h3>
        <p className="product-price">
          {item.price?.value} {item.price?.currency}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
