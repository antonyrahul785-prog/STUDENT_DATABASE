import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import InputField from '../common/Form/InputField';
import FormValidation from '../common/Form/FormValidation';
import './../../../styles/components/auth.css';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('verify'); // 'verify', 'reset', 'success'
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if token is in URL (for password reset)
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setStep('reset');
    }
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleVerificationChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    
    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      handleVerifyCode();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (step === 'reset') {
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
      
      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 'verify') {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestReset = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const result = await authService.requestPasswordReset({ email });
      
      if (result.success) {
        setStep('verify');
        setCountdown(60); // 1 minute countdown
      } else {
        setErrors({ general: result.message || 'Failed to send reset code' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({ verification: 'Please enter the 6-digit code' });
      return;
    }
    
    try {
      setLoading(true);
      const result = await authService.verifyResetCode({
        email,
        code: verificationCode
      });
      
      if (result.success) {
        setToken(result.token);
        setStep('reset');
      } else {
        setErrors({ verification: result.message || 'Invalid verification code' });
      }
    } catch (error) {
      setErrors({ verification: error.message || 'Invalid verification code' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      await authService.requestPasswordReset({ email });
      setCountdown(60);
      setErrors({}); // Clear any previous errors
    } catch (error) {
      setErrors({ general: error.message || 'Failed to resend code' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const result = await authService.resetPassword({
        token,
        password: formData.password
      });
      
      if (result.success) {
        setStep('success');
        
        // Auto-login if possible
        try {
          await login(email, formData.password);
        } catch (loginError) {
          // User can manually login
        }
      } else {
        setErrors({ general: result.message || 'Failed to reset password' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepVerify = () => (
    <div className="auth-form-wrapper">
      <div className="auth-header">
        <h2>Reset Your Password</h2>
        <p>Enter your email to receive a reset code</p>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleRequestReset(); }}>
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}
        
        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          error={errors.email}
          required
          autoFocus
        />
        
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Code'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>
          Remember your password?{' '}
          <button 
            className="btn-link"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );

  const renderStepVerification = () => (
    <div className="auth-form-wrapper">
      <div className="auth-header">
        <h2>Enter Verification Code</h2>
        <p>We sent a 6-digit code to {email}</p>
      </div>
      
      <form>
        {errors.verification && (
          <div className="alert alert-error">
            {errors.verification}
          </div>
        )}
        
        <div className="verification-input-group">
          <label>Verification Code</label>
          <div className="code-inputs">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={verificationCode[index] || ''}
                onChange={(e) => {
                  const newCode = verificationCode.split('');
                  newCode[index] = e.target.value.replace(/\D/g, '');
                  setVerificationCode(newCode.join(''));
                  
                  // Focus next input
                  if (e.target.value && index < 5) {
                    const nextInput = document.querySelector(`.code-inputs input:nth-child(${index + 2})`);
                    if (nextInput) nextInput.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                    const prevInput = document.querySelector(`.code-inputs input:nth-child(${index})`);
                    if (prevInput) prevInput.focus();
                  }
                }}
                className="code-input"
              />
            ))}
          </div>
        </div>
        
        <div className="resend-code">
          <p>
            Didn't receive the code?{' '}
            <button
              type="button"
              className={`btn-link ${countdown > 0 ? 'disabled' : ''}`}
              onClick={handleResendCode}
              disabled={countdown > 0 || loading}
            >
              Resend Code {countdown > 0 && `(${countdown}s)`}
            </button>
          </p>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setStep('verify');
              setVerificationCode('');
              setErrors({});
            }}
            disabled={loading}
          >
            Back
          </button>
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleVerifyCode}
            disabled={loading || verificationCode.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderStepReset = () => (
    <div className="auth-form-wrapper">
      <div className="auth-header">
        <h2>Create New Password</h2>
        <p>Your new password must be different from previous passwords</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}
        
        <div className="password-strength">
          <div className="strength-meter">
            <div 
              className="strength-bar"
              data-strength={FormValidation.getPasswordStrength(formData.password)}
            />
          </div>
          <span className="strength-text">
            {FormValidation.getPasswordStrengthText(formData.password)}
          </span>
        </div>
        
        <InputField
          label="New Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password"
          error={errors.password}
          required
          autoFocus
          icon={
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          }
        />
        
        <InputField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          error={errors.confirmPassword}
          required
          icon={
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          }
        />
        
        <FormValidation
          value={formData.password}
          type="password"
          show={formData.password.length > 0}
        />
        
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      
      <div className="password-requirements">
        <h4>Password Requirements:</h4>
        <ul>
          <li className={formData.password.length >= 8 ? 'valid' : ''}>
            At least 8 characters
          </li>
          <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
            One lowercase letter
          </li>
          <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
            One uppercase letter
          </li>
          <li className={/\d/.test(formData.password) ? 'valid' : ''}>
            One number
          </li>
          <li className={/[@$!%*?&]/.test(formData.password) ? 'valid' : ''}>
            One special character (@$!%*?&)
          </li>
        </ul>
      </div>
    </div>
  );

  const renderStepSuccess = () => (
    <div className="auth-form-wrapper success-state">
      <div className="success-icon">
        <div className="checkmark">✓</div>
      </div>
      
      <div className="auth-header">
        <h2>Password Reset Successful!</h2>
        <p>Your password has been reset successfully</p>
      </div>
      
      <div className="success-message">
        <p>You can now login with your new password.</p>
        <p>You will be redirected to login in <span className="countdown">5</span> seconds...</p>
      </div>
      
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
      
      <div className="additional-info">
        <p className="text-muted">
          <small>
            If you didn't request this password reset, please contact our support team immediately.
          </small>
        </p>
      </div>
    </div>
  );

  return (
    <div className="reset-password-form">
      {step === 'verify' && renderStepVerify()}
      {step === 'verify' && verificationCode && renderStepVerification()}
      {step === 'reset' && renderStepReset()}
      {step === 'success' && renderStepSuccess()}
    </div>
  );
};

export default ResetPasswordForm;