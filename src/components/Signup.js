import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Signup = () => {
    const navigate = useNavigate()
    // State to hold form values
    const [formData, setFormData] = useState({
        userName: '',
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
        axios.post('http://localhost:8000/api/auth/signup', formData).then((res) => {
            localStorage.setItem('token', JSON.stringify(res.data.token))
            localStorage.setItem('userId', res.data.user._id)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/')
        }).catch(error => {
            console.log(error)
        });
        setFormData({
            userName: '',
            email: '',
            password: ''
        });
    };

    return (
        <div className="auth-container">
            <div className='d-flex flex-column justify-content-center align-items-center py-5'>
                <h2>Sign Up</h2>
                <p className='form-title'>Welcome to WhatsApp</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />
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
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <div className="links">
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default Signup;
