import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../actions/userAction';
import './Login.css';
import Loading  from '../../Layouts/loading';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        // Handle successful login
        navigate('/profile');
      } 
    } catch (error) {
      alert("Sorry, we couldn't find an account with that email and password");
      console.log('Error:', error);
    } finally {
      return setLoading(false);
    }
  };
if(!loading) {
  <Loading />
}

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div className="register-link">
          <p>
            New to Allamrt? <Link to="/register">Register here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
