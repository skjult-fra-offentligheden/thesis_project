import { useState } from 'react';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const valid = email.includes('@') && email.includes('.');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (valid) onLogin();
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo-wrap">
          <img src="/everllence-logo.png" alt="Everllence" className="login-logo" />
        </div>

        <div className="login-divider" />

        <h1 className="login-title">Sign in to CEON</h1>
        <p className="login-subtitle">
          Enter your Everllence account email to continue.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email address</label>
            <input
              className="login-input"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <button
            className="login-btn"
            type="submit"
            disabled={!valid}
          >
            Sign in
          </button>
        </form>

        <p className="login-footer">
          Access is restricted to authorised Everllence users.
        </p>
      </div>
    </div>
  );
}
