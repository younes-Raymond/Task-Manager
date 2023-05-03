import React, { useEffect, useState } from 'react';
import { getProducts } from '../../actions/productaction';
import { sendRequest } from '../../actions/productaction';

import './ProductDetailPage.css'; 

const ProductDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [email, setemail] = useState('');
  const [user, setUser] = useState({ name: '', destination: '', email: '' });
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log(data)
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  console.log(products); /// thos is will log all the product or i can say main products 

  const handleBuy = async (productId, userId) => {
    setShowForm(userId); // Set showForm to the user's id when the button is clicked
  };
  
  const handleBuyit = async (productId, userId) => {
    setShowForm(productId); // Set showForm to the user's id when the button is clicked  
};


const submitHandler = async (event, productId) => {
  event.preventDefault();
  const formId = event.target.id;
  productId = formId.split('-')[1];
  console.log(productId)
  try {
    const response = await fetch(`/api/v1/admin/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, destination, email }),
    });
    const updatedProduct = await response.json();
    setResponse({
      productId: updatedProduct._id,
      message: 'Product bought successfully!',
    });
    setShowForm(false); // Set showForm to false after the form is submitted
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

console.log(products); 

  const handleFormSubmit = async (event, userId, productId) => {
    event.preventDefault();
    if (name && destination && email) {
      setSubmitting(true);
      try {
        const response = await sendRequest(userId, productId, name, destination, email); // Pass the name, destination, and emailvalues to the sendRequest function
        const updatedProduct = response.product;
        setResponse({
          productId: updatedProduct._id,
          message: 'Request sent successfully!',
        });
        setShowForm(false); // Hide the form after the request is sent
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
          message: 'Error sending request.',
        });
      }
      setSubmitting(false);
    }
  };


 
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (


 
//  start the product container 
    <div className="product-container">
    { console.log(products) }
      {products.map((product) => (
        <div key={product._id} className="product">
          {console.log(product,product.images ,`this is the current product id ${product._id}`,'hello from  product inside product-container')}
           
          <div className="product-image">
            <img src={product.images.url} alt={product.name} onError={(e) => console.log(e)}  />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <label htmlFor="stock">
              Stock:
              <p  className={`counter ${product.stock > 0 ? 'green' : 'red'}`}>{product.stock}</p>
            </label>
            <p>Category: {product.category}</p>

{/* start   user container  */}
<div className="users-container">
  <h3>Users who have taken this material:</h3>
  <ul>
    {product.users.map((user, index) => (
      <li key={index}>
        <button onClick={() => handleBuy(product._id, user._id)}>Send Request</button> {/* Pass the user'to the handleBuy function */}
        <p>Name: {user.name}</p>
        <p>Destination: {user.destination}</p>
        <p>email: {user.email}</p>
        <p>Taken at: {new Date(user.takenAt).toLocaleString()}</p> 
 <form 
  id={user._id} // Use the user's id as the id attribute
  className={`request-form ${showForm && showForm === user._id ? 'show' : ''}`} // Add the show class to the form when showForm is true and matches the user's id
  onSubmit={(event) => handleFormSubmit(event, user._id, product._id)}
>
          <label>
            Name:
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Destination:
            <input type="text" value={destination} onChange={(event) => setDestination(event.target.value)} />
          </label>
          <label>
            email:
            <input type="email" value={email} onChange={(event) => setemail(event.target.value)} />
          </label>
          <button type="submit" disabled={loading || submitting}>Submit</button>
        </form>
      </li>
    ))}
  </ul>
</div>
{/* end user container */}


{product.stock > 0 && (
<button onClick={() => handleBuyit(product._id)}>Get</button>
)}

    {showForm === product._id && (
      <form id={`form-${product._id}`}
       className={product.stock > 0 ? 'show' : ''} 
       onSubmit={submitHandler}
       >
<label htmlFor={`name-${product._id}`}>Name:</label>
<input
  type="text"
  id={`name-${product._id}`}
  value={name}
  onChange={(event) => setName(event.target.value)}
  disabled={loading || submitting}
/>
<label htmlFor={`destination-${product._id}`}>Destination:</label>
<input
  type="text"
  id={`destination-${product._id}`}
  value={destination}
  onChange={(event) => setDestination(event.target.value)}
  disabled={loading || submitting}
/>
<label htmlFor={`email-${product._id}`}>Email:</label>
<input
  type="email"
  id={`email-${product._id}`}
  value={email}
  onChange={(event) => setemail(event.target.value)}
  placeholder="Enter your email"
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
    // end the product container 

  );
};

export default ProductDetailPage;