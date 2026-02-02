import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
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

const CAROUSEL_INTERVAL = 3000; // 3 seconds per slide
const MIN_PASSWORD_LENGTH = 6;
const LOGIN_SIMULATION_DELAY = 3500; // 1.5 seconds

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

  return (
    <div className="min-h-screen w-full flex overflow-hidden" role="main">

      {/* ====================================================================
          LEFT SIDE - BRANDING & IMAGE (Desktop Only)
          ==================================================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 p-4 lg:p-6 items-center justify-center bg-white">
        {/* Branding Card with Carousel */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-900 ring-1 ring-slate-900/5">
          {/* Carousel Container */}
          <div className="absolute inset-0 z-0" role="region" aria-label="Product showcase carousel">
            {SLIDE_IMAGES.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-[1500ms] ease-out",
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-110"
                )}
                aria-hidden={index !== currentSlide}
              >
                <img
                  src={slide}
                  alt={`Product showcase ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
              </div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-end h-full p-12 lg:p-16">
            <div className="space-y-8 max-w-2xl transform transition-all duration-500">
              
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-emerald-300 w-fit animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  System Operational
               </div>

              {/* Main Text */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight font-display tracking-tight text-white animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                  Enter the Future of <br/>
                  <span className="text-emerald-400">Quality Assurance</span>
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed font-light max-w-md animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                  Experience the next generation of pharmaceutical quality
                  management. Intelligent, compliant, and secure.
                </p>
              </div>

              {/* Minimalist Indicators */}
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-700 delay-300" role="tablist" aria-label="Carousel controls">
                {SLIDE_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500 ease-out focus:outline-none",
                      index === currentSlide
                        ? "w-12 bg-emerald-500"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? "true" : "false"}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RIGHT SIDE - LOGIN FORM
          ==================================================================== */}
      <div className="w-full lg:w-1/2 xl:w-2/5 relative flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        {/* Form Container */}
        <div className="w-full max-w-md">
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
                  className="rounded-xl w-full h-12 mt-6 text-base font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all group"
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
