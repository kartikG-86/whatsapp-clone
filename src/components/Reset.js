import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reset = () => {
    const navigate = useNavigate()
    // State to hold form values
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
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
        axios.post('http://localhost:8000/api/auth/reset', formData).then((res) => {
            navigate('/login')

        }).catch(error => {
            console.log(error)
        });
        // Do something with the form data, like sending it to a server
        setFormData({
            confirmPassword: '',
            email: '',
            newPassword: ''
        });
    };

    return (
        <div className="auth-container">
            <div className='d-flex flex-column justify-content-center align-items-center py-5'>
                <h2>Forgot Password?</h2>
                <p className='form-title'>Reset your password to continue 😊</p>
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
                        name="newPassword"
                        placeholder="Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
            <div className="links">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
};

export default Reset;
