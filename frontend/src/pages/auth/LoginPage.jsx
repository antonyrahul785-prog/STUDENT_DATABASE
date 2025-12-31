import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, loading } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required')
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        const result = await login(values.email, values.password);
        
        if (result.success) {
            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            setErrors({ general: result.error });
            toast.error(result.error);
        }
        setSubmitting(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <h1>Edu<span>Manage</span></h1>
                        <p>Education Management System</p>
                    </div>
                    <h2>Sign in to your account</h2>
                    <p className="subtitle">Enter your credentials to access your dashboard</p>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors }) => (
                        <Form className="login-form">
                            {errors.general && (
                                <div className="error-message">
                                    {errors.general}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="form-input"
                                />
                                <ErrorMessage name="email" component="div" className="error-text" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="form-input"
                                />
                                <ErrorMessage name="password" component="div" className="error-text" />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={isSubmitting || loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="login-footer">
                                <p>
                                    Demo Credentials: <br />
                                    <small>
                                        Admin: admin@edumanage.com / admin123<br />
                                        Employee: employee@edumanage.com / employee123<br />
                                        Student: student@edumanage.com / student123
                                    </small>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="login-links">
                    <p>
                        Need help? <Link to="/contact-support">Contact Support</Link>
                    </p>
                    <p className="copyright">
                        © {new Date().getFullYear()} EduManage. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;