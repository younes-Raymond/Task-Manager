import React, { useEffect, useState } from 'react';
import { getProducts } from '../../actions/productaction';
import './ProductDetailPage.css'; 


   const ProductDetailPage = () => {
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [products, setProducts] = useState([]);
     const [response, setResponse] = useState(null);
     const handleBuy = async (productId) => {
      try {
        const response = await fetch(`/api/v1/admin/product/${productId}`, {
          method: 'PUT',
        });
        const updatedProduct = await response.json();
        setResponse({
          productId: updatedProduct._id,
          message: 'Product bought successfully!',
        });
      } catch (error) {
        console.log(error);
        setResponse({
          productId,
          message: 'Error buying product.',
        });
      }
    };
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
     if (loading) {
       return <div>Loading...</div>;
     }
     if (error) {
       return <div>Error: {error}</div>;
     }
     return (
      <div className="product-container">
      {products.map((product) => (
        <div id={product._id} className="product">
          <div className="product-image">
            <img src={product.images.url} alt={product.name} />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <label  htmlFor="stock">Stock:<p className='counter'>{product.stock}</p></label>
            <p>Category: {product.category}</p>
            <button onClick={() => handleBuy(product._id)}>Get</button>            
          </div>
          <div className={`light ${product.stock > 0 ? 'green' : 'red'}`}></div>
        </div>
      ))}
    </div>
     );
   };

   export default ProductDetailPage;