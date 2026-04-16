// src/admin/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useLocation} from "react-router-dom";

const Login = ({ onLogin }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, loginData);
            localStorage.setItem('adminToken', response.data.token);
            toast.success('Вход выполнен успешно!');
            onLogin(); // Просто вызываем callback, без навигации
        } catch (error) {
            toast.error('Неверный email или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ap-login-page">
            <div className="ap-login-container">
                <div className="ap-login-header">
                    <div className="ap-logo" style={{ justifyContent: 'center' }}>
                        <span className="ap-logo-icon">🏗️</span>
                        <span className="ap-logo-text">Almaty Build Admin</span>
                    </div>
                    <p>Введите учетные данные для входа</p>
                </div>
                <form onSubmit={handleSubmit} className="ap-login-form">
                    <input
                        type="email"
                        className="ap-login-input"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        className="ap-login-input"
                        placeholder="Пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                    />
                    <button type="submit" className="ap-login-btn" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;