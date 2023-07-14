
import React, { useEffect, useState } from "react";
import './add-material.css';
import { createProduct, clearErrors } from '../../actions/productaction';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from './SideBar/SideBar'
const ProductForm = () => {
  
const dispatch = useDispatch()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState(1);
  const [category, setCategory] = useState('');
  
  const handleProductImageChange = (e) => {
    const files = e.target.files[0];
    setFileToBase(files);
    console.log(files)
  }


  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImages((prevImages) => [...prevImages, reader.result]);
    }
  }

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.set('name', name);
  formData.set('description', description);
  formData.set('stock', stock);
  formData.set('category', category);

  images.forEach((image) => {
    formData.append('images', image);
    console.log(formData)

  });

  dispatch(createProduct(formData));
}

const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.value === 'setting' || event.target.value === 'adapting' || event.target.value === 'cutting') {
      setCategory(event.target.value);
    }
  };
  return (
    <>
    <div className="wrapper">
     <SideBar />            
    <div className="containerr">  
      <div className="Main-Mobile"> 
      <h2>Add Materials...</h2>
      <div className="option-container">
        <label htmlFor="list-option" className="label-option">Choose a Category:</label>
        <select name="category" id="list-option" required autoFocus onChange={handleChange} value={selectedValue}>
          <option id="intro-optn" value="--Please choose a Category">--Please choose a Category</option>
          <option value="cutting">cutting</option>
          <option value="adapting">Adapting</option>
          <option value="setting">Setting</option>
        </select>
      </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            autoFocus
            type="text"
            placeholder="اكتب اكتر من  ثلات حروف"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={3}
            maxLength={50}
            required
          />
          <br />
          <label htmlFor="description">Description:</label>
          <input 
            placeholder=" اكتب اكتر من  عشر حروف "
            type="text"
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={10}
            maxLength={200}
            required
          />
          <br />
          <label htmlFor="images">Images:</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            id="images"
            onChange={handleProductImageChange}
            required
          />
          <br />
          <label htmlFor="stock">Stock:</label>
          <input
            placeholder="enter how much material do you have"
            type="number"
            id="stock"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            min={1}
            max={1000}
            required
          />
          <br />
          <label htmlFor="category">Category:</label>
          <input
            placeholder="كتب اكتر من  ثلات حروف"
            type="text"
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            minLength={3}
            maxLength={30}
            required
          />
          <input type="submit" value='Add Material..' className="btn" />
        </form>
      </div>
    </div>
    </div>    
    </>
  );
};

export default ProductForm;


