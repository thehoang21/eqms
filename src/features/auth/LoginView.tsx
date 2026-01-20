import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronLeft, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import logoImg from '@/assets/images/logo_nobg.png';
import slide1 from '@/assets/images/slide-image/ipad1.webp';
import slide2 from '@/assets/images/slide-image/ipad2.webp';
import slide3 from '@/assets/images/slide-image/ipad3.webp';
import slide4 from '@/assets/images/slide-image/ipad4.webp';
import { IconArrowLeft } from '@tabler/icons-react';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  const slides = [slide1, slide2, slide3, slide4];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000); // Change slide every 2 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

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
    <div className="min-h-screen w-full flex overflow-hidden">
      {/* Mobile Splash Screen */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 bg-slate-900 transition-all duration-700 ease-in-out",
        showSplash ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-110 pointer-events-none"
      )}>
        {/* Carousel Background */}
          <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 ease-in-out",
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                <img 
                  src={slide} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            ))}
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />
          </div>

          {/* Splash Content */}
          <div className="relative z-10 h-full flex flex-col p-8 text-white">
            {/* Logo at Top */}
            <div className="pt-4 pb-8 flex justify-center">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-2xl mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Title & Description - Centered */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold leading-tight tracking-tight">
                  Quality Management System
                </h1>
                <p className="text-sm text-white/90 leading-relaxed max-w-sm mx-auto">
                  Next generation pharmaceutical quality management. Intelligent, compliant, and secure.
                </p>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="space-y-4">
              <Button
                onClick={() => setShowSplash(false)}
                size="default"
                className="w-full h-14 text-base font-bold shadow-2xl shadow-emerald-500/30"
              >
                Sign In
              </Button>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 pb-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === currentSlide 
                        ? "w-8 bg-white" 
                        : "w-1.5 bg-white/40"
                    )}
                  />
                ))}
              </div>

              {/* Footer */}
              <p className="text-xs text-center text-white/70 pb-4">
                A product of NTP Dev Team - Ngoc Thien Pharma.
              </p>
            </div>
          </div>
        </div>

      {/* Left Side - Branding & Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 p-4 lg:p-6 items-center justify-center bg-white">
        {/* Branding Card with Carousel */}
        <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-slate-600 ring-1 ring-black/5">
          {/* Carousel Container */}
          <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 ease-in-out",
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                <img 
                  src={slide} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14 text-white">
            {/* Top Content */}
            <div className="space-y-3">
              {/* Dark backdrop for text readability */}
              <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-slate-900/75 via-slate-900/20 to-transparent -mx-10 xl:-mx-14 -mt-10 z-[-1]" />
              <div className="space-y-4 relative z-10">
                <h1 className="text-5xl xl:text-6xl font-bold leading-tight font-display tracking-tight">
                  Enter the Future of
                  <span className="block mt-2 text-6xl xl:text-7xl">Quality Assurance</span>
                </h1>
                <p className="text-lg text-white leading-relaxed max-w-auto font-base">
                  Experience the next generation of pharmaceutical quality management. Intelligent, compliant, and secure.
                </p>
              </div>
            </div>
            {/* Footer */}
            <div className="relative">
              <p className="text-sm text-white/90">
                A product of NTP Dev Team - Ngoc Thien Pharma.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={cn(
        "w-full lg:w-1/2 xl:w-2/5 relative flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white transition-all duration-700 ease-in-out",
        showSplash ? "opacity-0 scale-95 lg:opacity-100 lg:scale-100" : "opacity-100 scale-100"
      )}>
        {/* Back Button (Mobile Only) */}
        <button
          onClick={() => setShowSplash(true)}
          className="lg:hidden absolute top-6 left-6 h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-20"
          aria-label="Back to splash"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>

        {/* Form Container */}
        <div className="w-full max-w-md mt-20 lg:mt-0">
          <div className="bg-white overflow-hidden">
            {/* Form Header */}
            <div className="px-6 sm:px-8 pt-8 pb-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center mb-4">
                  <img 
                    src={logoImg} 
                    alt="QualiGuard Logo" 
                    className="h-12 sm:h-14 w-auto object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome Back
                </h1>
                <p className="text-sm text-slate-600">
                  Sign in to access your account
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              {/* Login Error Alert */}
              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-red-900">Authentication Failed</p>
                    <p className="text-sm text-red-700 mt-0.5">{loginError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username/Email Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                    Username or Email
                  </label>
                  <div className="relative group">
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={cn(
                        "w-full h-12 px-4 text-sm font-medium border-2 rounded-xl transition-all",
                        "placeholder:text-slate-400 placeholder:font-normal",
                        "focus:outline-none focus:ring-4",
                        errors.username
                          ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                      )}
                      placeholder="Enter your username or email"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={cn(
                        "w-full h-12 pl-4 pr-12 text-sm font-medium border-2 rounded-xl transition-all",
                        "placeholder:text-slate-400 placeholder:font-normal",
                        "focus:outline-none focus:ring-4",
                        errors.password
                          ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                      )}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
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
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
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
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="default"
                  className="w-full h-12 mt-6 text-base font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-500 font-medium">Need help?</span>
                </div>
              </div>

              {/* Footer Text */}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <button className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline">
                    Contact Administrator
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
