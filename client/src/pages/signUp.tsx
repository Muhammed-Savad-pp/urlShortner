import React, { useState, type FormEvent } from 'react';
import { registerUser } from '../services/user/userService';
import type { IUserSignUp } from '../interface/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<IUserSignUp>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    const password = formData.password.trim();

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }   

    
    const confirmPassword = formData.confirmPassword.trim()
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } 
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {  
      return
    }
    setIsLoading(true)
    try {

        const response: any = await registerUser(formData);
        console.log(response);

        if(response.success) {
          toast.success(response.message);
          navigate('/login')
        } else {
          toast.error(response.message)
        }

    } catch (error) {
        setIsLoading(false)
        console.error(error)
    } finally  {
      setIsLoading(false)
    }

  };

  return (
    <div className=" bg-black flex items-center justify-center p-6 relative ">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mb-1 shadow-2xl shadow-green-500/30">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Join Us
          </h1>
          <p className="text-gray-400 text-md">
            Create your account in seconds
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-900/40 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-6">
            {/* Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className={`w-full pl-12 pr-2 py-3 bg-gray-800/50 border-2 rounded-2xl text-white placeholder-gray-400 
                  focus:outline-none focus:border-green-400 focus:bg-gray-800/70 transition-all duration-300
                  hover:border-gray-600 hover:bg-gray-800/60 text-lg
                  ${errors.name ? 'border-red-500 focus:border-red-400' : 'border-gray-600'}
                `}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 rounded-2xl text-white placeholder-gray-400 
                  focus:outline-none focus:border-green-400 focus:bg-gray-800/70 transition-all duration-300
                  hover:border-gray-600 hover:bg-gray-800/60 text-lg
                  ${errors.email ? 'border-red-500 focus:border-red-400' : 'border-gray-600'}
                `}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border-2 rounded-2xl text-white placeholder-gray-400 
                  focus:outline-none focus:border-green-400 focus:bg-gray-800/70 transition-all duration-300
                  hover:border-gray-600 hover:bg-gray-800/60 text-lg
                  ${errors.password ? 'border-red-500 focus:border-red-400' : 'border-gray-600'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border-2 rounded-2xl text-white placeholder-gray-400 
                  focus:outline-none focus:border-green-400 focus:bg-gray-800/70 transition-all duration-300
                  hover:border-gray-600 hover:bg-gray-800/60 text-lg
                  ${errors.confirmPassword ? 'border-red-500 focus:border-red-400' : 'border-gray-600'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] 
                hover:shadow-2xl hover:shadow-green-500/30 focus:outline-none focus:ring-4 focus:ring-green-500/40
                active:scale-[0.98] text-lg"
            >
             { isLoading ? 'Wait' : 'Create Account'} 
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-3 text-center">
            <p className="text-gray-400 text-lg">
              Already have an account?{' '}
              <button onClick={() => navigate('/login') } className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-300 hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-3">
          <p className="text-gray-500">
            By creating an account, you agree to our{' '}
            <button className="text-green-400 hover:text-green-300 transition-colors duration-300 hover:underline">
              Terms
            </button>
            {' '}and{' '}
            <button className="text-green-400 hover:text-green-300 transition-colors duration-300 hover:underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;