import axios from "axios";



// Login User
export const loginUser = async (email, password) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post('/api/v1/login', { email, password }, config);
    console.log('Login User:', data); // log user object to console
    // check if data excite and stored to db 
    if (data.user && data.user._id) {
      const user = {
        userId: data.user._id,
        email: data.user.email,
        name: data.user.name,
        avatar: data.user.avatar.url,
        gender: data.user.gender,
        role: data.user.role,
        takenAt: data.user.takenAt,
        reuestData: data.requestData,
      };
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('name', data.user.name);
    }
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
  export const getAllUsers = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/users');
      return data.users;
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  };