import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { cn } from "@/components/ui/utils";
import { resetViewportZoom, blurActiveInput } from "@/utils/viewport";
import logoImg from "@/assets/images/logo_nobg.png";
import slide1 from "@/assets/images/slide-image/ipad1.webp";
import slide2 from "@/assets/images/slide-image/ipad2.webp";
import slide3 from "@/assets/images/slide-image/ipad3.webp";
import slide4 from "@/assets/images/slide-image/ipad4.webp";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CAROUSEL_INTERVAL = 2000; // 2 seconds per slide
const MIN_PASSWORD_LENGTH = 6;
const LOGIN_SIMULATION_DELAY = 1500; // 1.5 seconds

const SLIDE_IMAGES = [slide1, slide2, slide3, slide4] as const;

const DEMO_CREDENTIALS = {
  username: "admin",
  password: "123456",
} as const;

const ERROR_MESSAGES = {
  USERNAME_REQUIRED: "Username or email is required",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  INVALID_CREDENTIALS: "Invalid username or password. Please try again.",
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface LoginViewProps {
  onLogin?: (username: string, password: string, rememberMe: boolean) => void;
}

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  username: string;
  password: string;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates login form data
 * @param data - Form data to validate
 * @returns Object containing validation errors (empty strings if no errors)
 */
const validateLoginForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {
    username: "",
    password: "",
  };

  if (!data.username.trim()) {
    errors.username = ERROR_MESSAGES.USERNAME_REQUIRED;
  }

  if (!data.password) {
    errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
  } else if (data.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }

  return errors;
};

/**
 * Checks if form has any validation errors
 * @param errors - Form errors object
 * @returns true if form is valid (no errors)
 */
const isFormValid = (errors: FormErrors): boolean => {
  return !errors.username && !errors.password;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * LoginView Component
 * Full-page login interface with splash screen, carousel, and form validation
 * 
 * @component
 * @example
 * ```tsx
 * <LoginView onLogin={(username, password, rememberMe) => {
 *   // Handle successful login
 * }} />
 * ```
 */
export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  // ========================================================================
  // STATE
  // ========================================================================

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  // ========================================================================
  // MEMOIZED VALUES
  // ========================================================================

  const hasFormErrors = useMemo(() => !isFormValid(errors), [errors]);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleInputChange = useCallback(
    (field: keyof Pick<FormData, "username" | "password">, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setLoginError("");
    },
    []
  );

  const handleRememberMeChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleCloseSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleOpenSplash = useCallback(() => {
    setShowSplash(true);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");

      // Validate form
      const validationErrors = validateLoginForm(formData);
      setErrors(validationErrors);

      if (!isFormValid(validationErrors)) {
        return;
      }

      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        // Check credentials
        if (
          formData.username === DEMO_CREDENTIALS.username &&
          formData.password === DEMO_CREDENTIALS.password
        ) {
          // Login successful - Reset viewport zoom before navigation
          blurActiveInput();
          resetViewportZoom();

          if (onLogin) {
            onLogin(formData.username, formData.password, formData.rememberMe);
          } else {
            console.log("Login successful:", formData);
          }
        } else {
          // Login failed
          setLoginError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
      }, LOGIN_SIMULATION_DELAY);
    },
    [formData, onLogin]
  );

  // ========================================================================
  // RENDER
  // ========================================================================

  const slides = [slide1, slide2, slide3, slide4];

  return (
    <div className="min-h-screen w-full flex overflow-hidden" role="main">
      {/* ====================================================================
          MOBILE SPLASH SCREEN
          ==================================================================== */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-slate-900 transition-all duration-700 ease-in-out",
          showSplash
            ? "visible scale-100"
            : "opacity-0 invisible scale-110 pointer-events-none"
        )}
        role="dialog"
        aria-label="Welcome screen"
        aria-hidden={!showSplash}
      >
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {SLIDE_IMAGES.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-1000 ease-in-out",
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              )}
            >
              <img
                src={slide}
                alt={`Product showcase ${index + 1}`}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          ))}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />
        </div>

        {/* Splash Content */}
        <div className="relative z-10 h-full flex flex-col p-6 sm:p-8 text-white">
          {/* Logo at Top */}
          <div className="pt-6 sm:pt-8 pb-6 sm:pb-8 flex justify-center">
            <img
              src={logoImg}
              alt="QMS Logo"
              className="h-14 sm:h-16 md:h-18 w-auto object-contain drop-shadow-2xl mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Title & Description - Centered */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
            <div className="space-y-3 max-w-lg">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-wide">
                Quality Management System
              </h1>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed tracking-wide">
                Next generation pharmaceutical quality management. Intelligent,
                compliant, and secure.
              </p>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="space-y-4">
            <Button
              onClick={handleCloseSplash}
              size="default"
              className="w-full h-12 sm:h-14 text-base font-semibold shadow-2xl shadow-emerald-500/30"
              aria-label="Continue to sign in"
            >
              Sign In
            </Button>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 pb-2" role="tablist" aria-label="Carousel slides">
              {SLIDE_IMAGES.map((_, index) => (
                <div
                  key={index}
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Slide ${index + 1} of ${SLIDE_IMAGES.length}`}
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

      {/* ====================================================================
          LEFT SIDE - BRANDING & IMAGE (Desktop Only)
          ==================================================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 p-4 lg:p-6 items-center justify-center bg-white">
        {/* Branding Card with Carousel */}
        <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-slate-600 ring-1 ring-black/5">
          {/* Carousel Container */}
          <div className="absolute inset-0 z-0" role="region" aria-label="Product showcase carousel">
            {SLIDE_IMAGES.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 ease-in-out",
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                )}
                aria-hidden={index !== currentSlide}
              >
                <img
                  src={slide}
                  alt={`Product showcase ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Carousel controls">
            {SLIDE_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900",
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? "true" : "false"}
                role="tab"
              />
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-10 xl:p-14 text-white">
            {/* Top Content */}
            <div className="space-y-3">
              {/* Dark backdrop for text readability */}
              <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-slate-900/75 via-slate-900/20 to-transparent -mx-8 lg:-mx-10 xl:-mx-14 -mt-8 lg:-mt-10 xl:-mt-14 z-[-1]" aria-hidden="true" />
              <div className="space-y-4 relative z-10">
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight font-display tracking-tight">
                  Enter the Future of
                  <span className="block mt-2 text-5xl lg:text-6xl xl:text-7xl">
                    Quality Assurance
                  </span>
                </h2>
                <p className="text-base lg:text-lg text-white leading-relaxed max-w-auto font-base">
                  Experience the next generation of pharmaceutical quality
                  management. Intelligent, compliant, and secure.
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

      {/* ====================================================================
          RIGHT SIDE - LOGIN FORM
          ==================================================================== */}
      <div
        className={cn(
          "w-full lg:w-1/2 xl:w-2/5 relative flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white transition-all duration-700 ease-in-out",
          showSplash
            ? "opacity-0 scale-95 lg:opacity-100 lg:scale-100"
            : "opacity-100 scale-100"
        )}
      >
        {/* Back Button (Mobile Only) */}
        <button
          onClick={handleOpenSplash}
          className="mt-6 sm:mt-8 lg:hidden absolute top-6 left-6 h-10 w-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Back to splash screen"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>

        {/* Form Container */}
        <div className="w-full max-w-md mt-16 sm:mt-20 lg:mt-0">
          <div className="bg-white overflow-hidden">
            {/* Form Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center mb-4">
                  <img
                    src={logoImg}
                    alt="QMS Logo"
                    className="h-12 sm:h-14 w-auto object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome Back
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Sign in to access your account
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              {/* Login Error Alert */}
              {loginError && (
                <div
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0" aria-hidden="true"></div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-red-900">
                      Authentication Failed
                    </p>
                    <p className="text-sm text-red-700 mt-0.5">{loginError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Username/Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Username or Email
                  </label>
                  <div className="relative group">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
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
                      aria-invalid={!!errors.username}
                      aria-describedby={errors.username ? "username-error" : undefined}
                    />
                  </div>
                  {errors.username && (
                    <p
                      id="username-error"
                      className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200"
                      role="alert"
                    >
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
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
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none focus:text-slate-700"
                      disabled={isLoading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200"
                      role="alert"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleRememberMeChange}
                    label="Remember me"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none focus:underline"
                    disabled={isLoading}
                    aria-label="Forgot password"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="default"
                  className="w-full h-12 mt-6 text-base font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all group"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6" aria-hidden="true">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-500 font-medium">
                    Need help?
                  </span>
                </div>
              </div>

              {/* Footer Text */}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <button
                    className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline focus:outline-none focus:underline"
                    aria-label="Contact administrator to create an account"
                  >
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
