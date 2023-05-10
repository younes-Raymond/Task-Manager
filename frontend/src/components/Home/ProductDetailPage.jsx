import React, { useEffect, useState } from 'react';
import { getProducts } from '../../actions/productaction';
import { sendRequest } from '../../actions/productaction';
import { updateProduct } from '../../actions/productaction';

import './ProductDetailPage.css'; 

const ProductDetailPage = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [destination, setDestination] = useState('');
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 

  
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





  const handleBuy = async (productId, userId) => {
    setShowForm(userId); // Set showForm to the user's id when the button is clicked
  };

  const handleBuyit = async (productId, userId) => {
    setShowForm(productId); // Set showForm to the user's id when the button is clicked  
  };



  const handleGetMaterial = async (event) => {
    const formId = event.target.id.split('-')[1];
    const productId = formId;
    const destination = event.target.elements[`destination-${productId}`].value; // Get the destination value from the input field
    const name = localStorage.getItem('name'); // Get the name value from localStorage
    const email = JSON.parse(localStorage.getItem('user')).email; // Get the email value from localStorage
    const userIdLS = localStorage.getItem('userId'); // Get the userId value from localStorage
    console.log(userIdLS)
    setShowForm(true);
    try {
      const updatedProduct = await updateProduct(productId, name, destination, email, userIdLS); // Pass the name, destination, and email values to the updateProduct function
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
      setResponse({
        productId,
        message: 'Error buying product.',
      });
    }
  };






  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };
  
  // Render the input field
  const handleSendRequest = async (event, userId, productId) => {
    event.preventDefault();
    const  userId_of_Taken  = document.querySelector('.user-id').textContent;
    console.log(userId_of_Taken)
    event.preventDefault();
    const formId = event.target.id.split('-')[1];
    const name = localStorage.getItem('name'); // Get the name value from localStorage
    const email = JSON.parse(localStorage.getItem('user')).email; // Get the email value from localStorage
    const userIdLS = localStorage.getItem('userId'); // Get the userId value from localStorage
    setShowForm(true); // Show the form

    if (name && destination && email && userId_of_Taken) {
      setSubmitting(true);
      try {
        const response = await sendRequest(productId, name, destination, email, userIdLS, userId_of_Taken ); // Pass the name, destination, and email values to the sendRequest function
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
      {products.map((product) => (
        <div key={product._id} className="product">
           
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
        <p className="user-id" style={{ display: 'none' }}>{user.userIdS}</p> {/* Add this line to display the userIdLS value */}
 <form 
  id={user._id} 
  className={`request-form ${showForm && showForm === user._id ? 'show' : ''}`} // Add the show class to the form when showForm is true and matches the user's id
  onSubmit={(event) => handleSendRequest (event, user._id, product._id)}
>
          <label>
            Destination:
            <input type="text" value={destination} onChange={handleDestinationChange} />
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
       onSubmit={handleGetMaterial}
       >


<label htmlFor={`destination-${product._id}`}>Destination:</label>
<input
  type="text"
  id={`destination-${product._id}`}
  value={destination}
  onChange={(event) => setDestination(event.target.value)}
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


}

export default ProductDetailPage;
