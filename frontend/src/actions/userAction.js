import axios from "axios";

// login user 
export const loginUser = async (email, password) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post('/api/v1/login', { email, password }, config);
    console.log(data)
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

export const registerUser = async (userData) => {
  console.log(userData); // log user data to console
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return axios.post("/api/v1/register", userData, config)
    .then((response) => {
      const { data } = response;
      // console.log('Registered User:', data.user); // log registered user object to console
      const user = {
        ...data.user,
        userId: data.user._id,
        email: data.user.email,
        name: data.user.name, // Add the name property to the user object
      };
      console.log(user)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('name', data.user.name); // Store the name property in the localStorage
      localStorage.setItem('email', data.user.email); // Store the name property in the localStorage
      
      return data;
    })
    .catch((error) => {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    });
};
  // Get All Users ---ADMIN

export const search = async (keyword) => {
    try {
      const response = await axios.get(`/api/v1/search?keyword=${keyword}`);
      // console.log(response.data)
      localStorage.setItem("result", JSON.stringify(response.data));
      var storedData = JSON.parse(localStorage.getItem("result"));
      console.log(storedData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
};

  export const getAllUsers = async () => {
    try {
      const { data } = await axios.get('/api/v1/workers');
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  };

  export const getAllMaterialRequester = async () => {
    try {
      const response = await axios.get('/api/v1/materialrequesters');
      return response.data;
    } catch (error) {
      console.error('Error fetching material requesters:', error);
      throw error;
    }
  };

  export const getAllJobs = async () => {
    try {
     const response = await axios.get('/api/v1/jobs');
     return response.data;
    } catch (error) {
      console.error('Error fetching jobs requesters:', error)
      throw error;
    }
  }
  

  
  