import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
    const navigate = useNavigate();
    // State to hold form values
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/auth/login', formData).then((res) => {
            localStorage.setItem('token', JSON.stringify(res.data.token))
            localStorage.setItem('userId', res.data.user._id)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/')

        }).catch(error => {
            console.log(error)
        });
        setFormData({

            email: '',
            password: ''
        });
    };

    return (
        <div className="auth-container">
            <div className='d-flex flex-column justify-content-center align-items-center py-5'>
                <h2>Login</h2>
                <p className='form-title'>Welcome back to WhatsApp</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>

                <div className="d-flex flex-row justify-content-between my-5" style={{ width: '20rem' }}>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/reset">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
