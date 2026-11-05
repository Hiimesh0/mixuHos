import React, { useState } from 'react';
import { Eye, EyeOff, Lock, HeartPulse, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import mixuEmblem from '../../assets/mixu-emblem.png';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pass123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Verify credentials
    setTimeout(() => {
      const u = username.trim().toLowerCase();
      if ((u === 'admin' || u === 'admin@mixu.com' || u === 'admin@hospital.com') && password === 'pass123') {
        onLogin();
        navigate('/patient-registration');
      } else {
        setError('Invalid email or password. Use demo credentials below.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className={styles.splitPageContainer}>
      <div className={styles.splitWrapper}>
        {/* Left Purple / Indigo Hero Branding Panel with Wave Contours and EHR Graphic */}
        <div className={styles.heroPanel}>
          {/* Decorative Wave Contours Background */}
          <div className={styles.waveOverlay} aria-hidden="true">
            <svg viewBox="0 0 500 500" preserveAspectRatio="none" className={styles.waveSvg}>
              <path
                d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"
                fill="rgba(255, 255, 255, 0.04)"
              />
              <path
                d="M0,280 C220,180 280,360 500,240 L500,500 L0,500 Z"
                fill="rgba(255, 255, 255, 0.03)"
              />
              <circle cx="420" cy="120" r="140" fill="rgba(124, 58, 237, 0.25)" />
              <circle cx="80" cy="380" r="160" fill="rgba(168, 85, 247, 0.15)" />
            </svg>
          </div>

          {/* Hero Content Container */}
          <div className={styles.heroContent}>
            {/* Top Emblem Brand Pill */}
            <div className={styles.heroBrandPill}>
              <img src={mixuEmblem} alt="Mixu Infosystem" className={styles.heroBrandEmblem} />
              <span className={styles.heroBrandText}>{HOSPITAL_CONFIG.name}</span>
            </div>

            {/* EHR Vector Illustration Art */}
            <div className={styles.illustrationWrapper} aria-hidden="true">
              <div className={styles.illustrationCard}>
                <div className={styles.illustrationCardHeader}>
                  <div className={styles.cardHeaderDot} style={{ background: '#ef4444' }} />
                  <div className={styles.cardHeaderDot} style={{ background: '#f59e0b' }} />
                  <div className={styles.cardHeaderDot} style={{ background: '#10b981' }} />
                  <span className={styles.cardHeaderTitle}>EMR Clinical Suite</span>
                </div>
                <div className={styles.illustrationCardBody}>
                  <div className={styles.pulseRow}>
                    <HeartPulse size={28} className={styles.pulseIcon} />
                    <div className={styles.pulseGraph}>
                      <span className={styles.pulseLine} />
                    </div>
                  </div>
                  <div className={styles.metricGrid}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Daily Patients</span>
                      <strong className={styles.metricVal}>148+</strong>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Active Reports</span>
                      <strong className={styles.metricVal}>99.4%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Copy */}
            <div className={styles.heroTextSection}>
              <h2 className={styles.heroTitle}>
                A few more clicks to<br />sign in to your account.
              </h2>
              <p className={styles.heroSubtitle}>
                Manage your hospital patients, clinical records, and billing in one seamless platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right White Form Panel */}
        <div className={styles.formPanel}>
          <div className={styles.formContainer}>
            {/* Header Brand & Welcome */}
            <div className={styles.formHeader}>
              <div className={styles.brandBadge}>
                <img src={mixuEmblem} alt="Mixu Logo" className={styles.formBrandLogo} />
                <span className={styles.formBrandName}>Mixu Infosystem</span>
              </div>
              <h1 className={styles.signInTitle}>Sign In</h1>
              <p className={styles.signInSubtitle}>
                Please enter your email & password.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className={styles.loginForm} onSubmit={handleLogin} noValidate>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="login-username">
                  Email
                </label>
                <div className={styles.inputFieldWrapper}>
                  <input
                    id="login-username"
                    type="text"
                    className={`${styles.textInput} ${error ? styles.textInputError : ''}`}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter Email or Username"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="login-password">
                  Password
                </label>
                <div className={styles.inputFieldWrapper}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.textInput} ${error ? styles.textInputError : ''}`}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordEyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className={styles.optionsRow}>
                <label className={styles.rememberLabel}>
                  <input
                    type="checkbox"
                    className={styles.rememberCheckbox}
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot-password"
                  className={styles.forgotLink}
                  onClick={e => {
                    e.preventDefault();
                    alert('Password recovery: Contact the hospital IT administrator or use the demo credentials provided below.');
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Continue / Sign In Action Button */}
              <button
                type="submit"
                className={styles.continueBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.btnLoadingText}>Signing In...</span>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>

            {/* Demo Credentials Box */}
            <div className={styles.demoCredentialsBox}>
              <div className={styles.demoTitle}>Demo Sign In Credentials</div>
              <div className={styles.demoRow}>
                <span>Email / User: <code>admin</code></span>
                <span>Password: <code>pass123</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
