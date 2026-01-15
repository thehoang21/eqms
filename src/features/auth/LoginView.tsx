import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import logoImg from '@/assets/images/logo_nobg.png';
import factoryLoginBg from '@/assets/images/factory-login.jpg';
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
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 md:p-6 lg:p-8">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src={factoryLoginBg} 
          alt="Factory Background" 
          className="w-full h-full object-cover blur-lg scale-105"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="h-14 w-auto px-3 sm:h-16 sm:px-4 md:h-20 md:px-6 bg-white rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center">
                <img 
                  src={logoImg} 
                  alt="QualiGuard Logo" 
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Welcome Back</h1>
            <p className="text-emerald-50 text-xl sm:text-2xl font-bold">Quality Management System</p>
          </div>

          {/* Form Section */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            {/* Login Error Alert */}
            {loginError && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-red-900">Login Failed</p>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">{loginError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
                    <IconUser className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={cn(
                      "w-full h-10 sm:h-11 pl-10 sm:pl-11 pr-3 sm:pr-4 text-sm border rounded-lg transition-colors",
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
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "w-full h-10 sm:h-11 pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm border rounded-lg transition-colors",
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
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
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
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0 pt-1">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                  label="Remember me"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="default"
                className="w-full mt-5 sm:mt-6"
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
                    {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <button className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Contact Administrator
            </button>
          </p>
        </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/90 font-base drop-shadow-md tracking-wide">
            &copy; {new Date().getFullYear()} Ngoc Thien Pharma. All rights reserved. EU-GMP Compliant.
          </p>
        </div>
      </div>
    </div>
  );
};
