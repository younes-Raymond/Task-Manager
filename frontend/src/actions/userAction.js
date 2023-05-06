import axios from "axios";



// Login User
export const loginUser = async (email, password) => {
    console.log(email, password)
    try {
        const config = {
            headers: {"Content-Type": "application/json",},}
        const { data } = await axios.post('/api/v1/login',{ email, password },config);
        return data;

    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.message);
        }
    }
};


export const registerUser = (userData) => {
    console.log(userData)
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return axios.post("/api/v1/register", userData, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error(error.message);
        }
      });
  };