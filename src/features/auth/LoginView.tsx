import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import logoImg from '@/assets/images/favicon/document-color-32.png';
import { IconUser } from '@tabler/icons-react';

interface LoginViewProps {
  onLogin?: (username: string, password: string, rememberMe: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
    };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Hard-coded credentials
      if (formData.username === 'admin' && formData.password === '123456') {
        // Login successful
        if (onLogin) {
          onLogin(formData.username, formData.password, formData.rememberMe);
        } else {
          console.log('Login successful:', formData);
        }
      } else {
        // Login failed
        setLoginError('Invalid username or password. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 relative overflow-hidden flex items-center justify-center p-4 md:p-6 lg:p-8">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 md:px-8 py-8 md:py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img 
                  src={logoImg} 
                  alt="QualiGuard Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-emerald-50 text-sm md:text-base">Sign in to continue to Zenith Quality</p>
          </div>

          {/* Form Section */}
          <div className="px-6 md:px-8 py-8">
            {/* Login Error Alert */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Login Failed</p>
                  <p className="text-sm text-red-700 mt-1">{loginError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <IconUser className=" text-slate-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={cn(
                      "w-full h-11 pl-11 pr-4 text-sm border rounded-lg transition-colors",
                      "placeholder:text-slate-400",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                      errors.username
                        ? "border-red-300 bg-red-50/50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                    placeholder="Enter your username or email"
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "w-full h-11 pl-11 pr-11 text-sm border rounded-lg transition-colors",
                      "placeholder:text-slate-400",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                      errors.password
                        ? "border-red-300 bg-red-50/50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                  label="Remember me"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="default"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <button className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Contact Administrator
            </button>
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Zenith Quality. All rights reserved. EU-GMP Compliant.
        </div>
      </div>
    </div>
  );
};
