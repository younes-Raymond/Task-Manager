import React, { useEffect, useState } from 'react';
import { getProducts } from '../../actions/productaction';

import './ProductDetailPage.css'; 

const ProductDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState({ name: '', destination: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const handleBuy = async (productId) => {
    // console.log(productId)
    const product = products.find((product) => product._id === productId);
    if (product.stock > 0) {
      setShowForm(productId);
    }
  };
  
  const submitHandler = async (event, productId) => {
    event.preventDefault();
    const formId = event.target.id;
     productId = formId.split('-')[1];
     console.log(productId)
    try {
      const { name, destination, phone } = user;
      const response = await fetch(`/api/v1/admin/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, destination, phone }),
      });
      const updatedProduct = await response.json();
      setResponse({
        productId: updatedProduct._id,
        message: 'Product bought successfully!',
      });
      setShowForm(false);
      const updatedProducts = products.map((product) => {
        if (product._id === productId) {
          return updatedProduct;
        }
        return product;
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.log(error);
      setResponse({
        productId,
        message: 'Error buying product.',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product._Id} className="product">
          <div className="product-image">
            <img src={product.images.url} alt={product.name} />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <label htmlFor="stock">
              Stock:
              <p  className={`counter ${product.stock > 0 ? 'green' : 'red'}`}>{product.stock}</p>
            </label>
            <p>Category: {product.category}</p>
            <div className="users-container">
  <h3>Drary li Mkhargin Had  material:</h3>
  <ul>
    {product.users.map((user, index) => (
      <li key={index}>
        <p>Name: {user.name}</p>
        <p>Destination: {user.destination}</p>
        <p>Phone: {user.phone}</p>
        <p>Taken at: {new Date(user.takenAt).toLocaleString()}</p> 
      </li>
    ))}
  </ul>
</div>
            {product.stock > 0 && (
              <button onClick={() => handleBuy(product._id)}>Get</button>
            )}
            {/* product info */}
    {showForm === product._id && (
      <form id={`form-${product._id}`}
       className={product.stock > 0 ? 'show' : ''} 
       onSubmit={submitHandler}
       >
<label htmlFor={`name-${product._id}`}>Name:</label>
    <input
      type="text"
      id={`name-${product._id}`}
      value={user.name}
      onChange={(event) => setUser({ ...user, name: event.target.value })}
      disabled={loading || submitting}
    />
    <label htmlFor={`destination-${product._id}`}>Destination:</label>
    <input
      type="text"
      id={`destination-${product._id}`}
      value={user.destination}
      onChange={(event) => setUser({ ...user, destination: event.target.value })}
      disabled={loading || submitting}
    />
    <label htmlFor={`phone-${product._id}`}>Phone:</label>
    <input
     type="tel"
     id={`phone-${product._id}`}
     value={user.phone}
     onChange={(event) => setUser({ ...user, phone: event.target.value })}
     placeholder="Enter your phone number"
     maxLength="20"
     disabled={loading || submitting}
   />
    <button type="submit"  disabled={loading || submitting}>Submit</button>
      </form>

    )}
  
          </div>
          <div className={`light ${product.stock > 0 ? 'green' : 'red'}`}></div>
        </div>
      ))}
    </div>
  );
};

export default ProductDetailPage;