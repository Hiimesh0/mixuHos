import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <ShieldAlert size={36} />
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
        Access Restricted
      </h2>

      <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '480px', lineHeight: 1.6, margin: '0 0 24px' }}>
        Your assigned institutional role does not have permission to access this module.
        If you require operational access, please contact your Super Admin or Hospital Administrator.
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#334155'
          }}
        >
          <ArrowLeft size={16} /> Go Back
        </button>

        <button
          type="button"
          onClick={() => navigate('/today-report-dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#0284c7',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#ffffff'
          }}
        >
          <Home size={16} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
