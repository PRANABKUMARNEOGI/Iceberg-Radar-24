import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Phone, Globe, X } from 'lucide-react';

export default function Login({ onSuccess, onLogin, setIsLoggedIn, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    operatorId: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Triggers login across all possible prop names
  const triggerLogin = (userData) => {
    if (typeof onSuccess === 'function') onSuccess(userData);
    if (typeof onLogin === 'function') onLogin(userData);
    if (typeof setIsLoggedIn === 'function') setIsLoggedIn(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleSocialLogin = (provider) => {
    triggerLogin({
      operatorId: `${provider.toUpperCase()}-USER`,
      name: `${provider} Authenticated User`,
      email: `user@${provider.toLowerCase()}.com`
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans overflow-y-auto">
      
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 my-auto shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-700 pb-8">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 mb-1">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold tracking-wide text-white uppercase font-mono">
            {isSignUp ? 'Operator Registration' : 'Operator Login'}
          </h2>
          <p className="text-[11px] text-slate-400">
            {isSignUp
              ? 'Create your credentials for 3D polar telemetry access'
              : 'Unlock full cryosphere 3D telemetry and analytics'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isSignUp
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isSignUp
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-center uppercase tracking-wider text-slate-500 font-bold">
            {isSignUp ? 'Or Sign Up With' : 'Or Quick Sign In With'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-[11px] text-slate-200 transition font-medium cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Instagram')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-[11px] text-slate-200 transition font-medium cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-pink-500" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2 1.7-4.8 4.9-4.9 1.2-.1 1.6-.1 4.8-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z"/>
              </svg>
              Instagram
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-[11px] text-slate-200 transition font-medium cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-blue-500" viewBox="0 0 24 24">
                <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-slate-500 font-mono uppercase">Credentials</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Inputs Form */}
        <div className="space-y-3">
          {isSignUp && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Commander Alex Mercer"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="operator@cryosphere.org"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* Operator ID */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              {isSignUp ? 'Assign Operator ID / User ID' : 'Operator ID / Email / User ID'}
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                name="operatorId"
                placeholder="admin or OP-8042"
                value={formData.operatorId}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Access Code / Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              {isSignUp ? 'Set Password' : 'Access Code / Password'}
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={() => triggerLogin({
              operatorId: formData.operatorId || 'OPERATOR-01',
              name: formData.name || 'Polar Explorer',
              email: formData.email || 'operator@cryosphere.org'
            })}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-200 mt-4 cursor-pointer relative z-20"
          >
            {isSignUp ? 'Complete Registration & Access Portal' : 'Log In to Dashboard'}
          </button>
        </div>

      </div>
    </div>
  );
}