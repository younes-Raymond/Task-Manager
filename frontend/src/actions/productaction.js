import axios from "axios";

import {
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
  NEW_PRODUCT_FAIL,
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  SLIDER_PRODUCTS_REQUEST,
  SLIDER_PRODUCTS_SUCCESS,
  SLIDER_PRODUCTS_FAIL
} from "../constants/productConstants";
// New material ---ADMIN
export  const createProduct = (productData) => async (dispatch) => {
  try {
      dispatch({ type: NEW_PRODUCT_REQUEST });
      const config = { header: { "Content-Type": "application/json" } }
      const { data } = await axios.post("/api/v1/admin/material/new", productData, config);
      dispatch({
          type: NEW_PRODUCT_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: NEW_PRODUCT_FAIL,
          payload: error.response.data.message,
      });
  }
}

// Get All Products ---material SLIDER
export const getProducts = async () => {
  try {
    const { data } = await axios.get('/api/v1/admin/products/all');
    return data;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.response.data.message);
  }
};

// Get from Get buttton when user
export const updateProduct = async (productId, name, destination, email, userIdLS , latitude, longitude) => {
  try {
    const config = { header: { "Content-Type": "application/json" } }
    const { data } = await axios.put(`/api/v1/admin/material/${productId}`, {
       name,
      destination, 
      email,
      userIdLS,
      latitude,
      longitude
    }, config);
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// send a request to the worker who already use the material 
export const sendRequest = async (materialId, name, destination, email, userIdLS, userId_of_Taken) => {
  try {
    const { data } = await axios.post("/api/v1/material/request", { materialId, name, destination, email, userIdLS, userId_of_Taken });
    console.log(data); // add this line to log the data
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
};






