import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Lock, Mail, User as UserIcon, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onNavigateHome: () => void;
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigateHome,
  onAuthSuccess,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestFill = (testEmail: string) => {
    setMode('login');
    setEmail(testEmail);
    setPassword('password123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please provide your full legal or preferred name (minimum 2 characters).');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please provide your account password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: mode === 'login' ? 'Sign In' : 'Register', active: true },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#123C35]">
            Nexora Client Account
          </span>
          <h1 className="text-2xl font-semibold text-[#171A19] tracking-tight">
            {mode === 'login' ? 'Sign in to your account' : 'Create your Nexora account'}
          </h1>
          <p className="text-xs text-[#666B67] leading-relaxed">
            {mode === 'login'
              ? 'Access past order receipts, stored destinations, and curated preferences.'
              : 'Join Nexora to track shipments, save bespoke instruments, and enjoy expedited checkout.'}
          </p>
        </div>

        {/* Quick Demo Accounts Pill Bar for instant testing */}
        <div className="p-3 bg-[#F7F5F0] border border-[#E4E1DA] rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-[#123C35] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Test Credentials (Evaluator Demo):</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleTestFill('alex@nexora.design')}
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] rounded-md text-[11px] font-medium text-[#171A19] transition-colors cursor-pointer"
            >
              Fill Alex Morgan (Bengaluru)
            </button>
            <button
              type="button"
              onClick={() => handleTestFill('priya@nexora.design')}
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] rounded-md text-[11px] font-medium text-[#171A19] transition-colors cursor-pointer"
            >
              Fill Priya Sharma (Mumbai)
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F1D0D0] rounded-xl flex items-start gap-2.5 text-xs text-[#A94747]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#666B67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-[#F7F5F0] border border-[#E4E1DA] focus:border-[#123C35] rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-[#171A19]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666B67] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-[#F7F5F0] border border-[#E4E1DA] focus:border-[#123C35] rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-[#171A19]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
                Password
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-[#666B67]/80">
                  Default: password123
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666B67] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F5F0] border border-[#E4E1DA] focus:border-[#123C35] rounded-lg pl-9 pr-10 py-2.5 text-sm text-[#171A19]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666B67] hover:text-[#171A19] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666B67] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666B67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F7F5F0] border border-[#E4E1DA] focus:border-[#123C35] rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-[#171A19]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#123C35] hover:bg-[#0D302A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Toggle */}
        <div className="text-center pt-2 border-t border-[#E4E1DA]">
          {mode === 'login' ? (
            <p className="text-xs text-[#666B67]">
              Don't have a Nexora account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-[#123C35] font-semibold hover:underline cursor-pointer"
              >
                Register here
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#666B67]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#123C35] font-semibold hover:underline cursor-pointer"
              >
                Sign in to your account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
