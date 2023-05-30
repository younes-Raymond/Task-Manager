import React, { useEffect, useState , useRef} from 'react';
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
 const inputRef = useRef(null);
  
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
    inputRef.current.focus()
  };


  const handleGetMaterial = async (event) => {
    const formId = event.target.id.split('-')[1];
    const productId = formId;
    const destination = event.target.elements[`destination-${productId}`].value;
    const name = localStorage.getItem('name');
    const email = JSON.parse(localStorage.getItem('user')).requestData.email;
    const userIdLS = localStorage.getItem('userIdLS');
    console.log(userIdLS);
    setShowForm(true);
    try {
      const updatedProduct = await updateProduct(productId, name, destination, email, userIdLS);
      setResponse({
        productId: updatedProduct._id,
        message: 'Material bought successfully!',
      });
      setShowForm(false);
      const updatedProducts = products.map((material) => {
        if (material._id === productId) {
          return updatedProduct;
        }
        return material;
      });
      setProducts(updatedProducts);
    } catch (error) {
      setResponse({
        productId,
        message: 'Error buying material.',
      });
    }
  };

const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };
  
  const handleSendRequest = async (event, userId, productId) => {
    event.preventDefault();
    const userId_of_Taken = document.querySelector('.user-id').textContent;
    console.log("userId_of_Taken: ",userId_of_Taken);
    const formId = event.target.id.split('-')[1];
    const user = JSON.parse(localStorage.getItem('user')); 
    const email = user.requestData.email;
    const name = user.requestData.name; 
    const userIdLS = localStorage.getItem('userIdLS'); 
    setShowForm(true); 
    if (name && destination && email && userId_of_Taken) { 
      setSubmitting(true);
      try {
        const response = await sendRequest(productId, name, destination, email, userIdLS, userId_of_Taken); 
        console.log('this is the response: ', response);
        const updatedProduct = response.material;
        setResponse({
          productId: updatedProduct._id,
          message: 'Request sent successfully!',
        });
        setShowForm(false);
        const updatedProducts = products.map((material) => {
          if (material._id === productId) {
            return updatedProduct;
          }
          return material;
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
    return <div className="loading_container">
       <div className='custom-loader'></div>
       <p>loading....</p>
       <p>please wait the data is loaded</p>
      </div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
//  start the material container 
    <div className="material-container">
      {products.map((material) => (
        <div key={material._id} className="material">
          <div className="material-image">
            <img src={material.images.url} alt={material.name} onError={(e) => console.log(e)}  />
          </div>
          <div className="material-info">
            <h2>{material.name}</h2>
            <p>{material.description}</p>
            <label htmlFor="stock">
              Stock:
              <p  className={`counter ${material.stock > 0 ? 'green' : 'red'}`}>{material.stock}</p>
            </label>
            <p>Category: {material.category}</p>

{/* start   user container  */}
<div className="users-container">
  <h3>Users who have taken this material:</h3>
  <ul>
    {material.users.map((user, index) => (
      
      <li key={index}>
        {console.log("im from material users array",user, "index: ",index)}
        <button onClick={() => handleBuy(material._id, user._id)}>Send Request</button> {/* Pass the user'to the handleBuy function */}
        <p>Name: {user.name}</p>
        <p>Destination: {user.destination}</p>
        <p>email: {user.email}</p>
        <p>Taken at: {new Date(user.takenAt).toLocaleString()}</p> 
        <p className="user-id" style={{ display: 'none' }}>{user._id}</p> {/* Add this line to display the userIdLS value */}
 <form 
  id={user._id} 
  className={`request-form ${showForm && showForm === user._id ? 'show' : ''}`} // Add the show class to the form when showForm is true and matches the user's id
  onSubmit={(event) => handleSendRequest (event, user._id, material._id)}
>
          <label>
            DestinatioN:
            <input type="text" value={destination} onChange={handleDestinationChange} />
          </label>
          <button type="submit" disabled={loading || submitting}>Submit</button>
        </form>
      </li>
    ))}
  </ul>
</div>
{/* end user container */}



{material.stock > 0 && (
<button onClick={() => handleBuyit(material._id)}>Get</button>
)}

    {showForm === material._id && (
      <form id={`form-${material._id}`}
       className={material.stock > 0 ? 'show' : ''} 
       onSubmit={handleGetMaterial}
       >


<label htmlFor={`destination-${material._id}`}>Destination:</label>
<input
ref={inputRef}
  type="text"
  id={`destination-${material._id}`}
  value={destination}
  onChange={(event) => setDestination(event.target.value)}
  disabled={loading || submitting}
/>


    <button type="submit"  disabled={loading || submitting}>Submit</button>
      </form>

    )}
          </div>
          <div className={`light ${material.stock > 0 ? 'green' : 'red'}`}></div>
        </div>
      ))}
    </div>
    // end the material container 

  );
}

export default ProductDetailPage;
