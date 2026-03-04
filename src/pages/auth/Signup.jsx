import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    company: ""
  });

  const validateField = (name, value) => {
    const errors = {};
    
    switch(name) {
      case 'username':
        if (value && !/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
          errors.username = 'Username must be 3-20 characters (letters, numbers, underscore only)';
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Invalid email format';
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, and number';
        }
        break;
    }
    
    return errors;
  };

  const handleFieldChange = (name, value) => {
    setFormData({...formData, [name]: value});
    
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors({...fieldErrors, [name]: null});
    }
    
    // Validate on blur (we'll add onBlur handlers)
  };

  const handleFieldBlur = (name, value) => {
    const errors = validateField(name, value);
    setFieldErrors({...fieldErrors, ...errors});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    
    try {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          company_name: formData.company
        });
        setSuccess(true);
        setTimeout(() => navigate('/app'), 1500); // Show success before redirect
    } catch (err) {
        console.error("Signup failed", err);
        
        // Enhanced error parsing
        const errorDetail = err.response?.data?.detail;
        if (Array.isArray(errorDetail)) {
          // Pydantic validation errors
          const messages = errorDetail.map(e => e.msg || e.message).join('. ');
          setError(messages);
        } else {
          setError(errorDetail || "Registration failed. Please try again.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32 min-h-screen bg-[#f8f9fc]">
       <div className="p-4 md:p-8 max-w-[1600px] mx-auto h-full">
         <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[85vh] overflow-hidden isolate flex">
            
            {/* Left Side: Marketing - Dark Mode */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative items-center justify-center p-20 overflow-hidden isolate">
                {/* Abstract Shapes */}
                <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#195bac] rounded-full blur-[150px] opacity-20 -z-10 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-600 rounded-full blur-[100px] opacity-20 -z-10"></div>
                
                <div className="relative z-10 text-white max-w-lg">
                    <div className="mb-10 w-16 h-16 bg-white/10 backdrop-blur rounded-[20px] flex items-center justify-center border border-white/10">
                        <img src={logo} className="w-8 h-8 brightness-0 invert" alt="Logo" />
                    </div>
                    <h1 className="text-5xl font-black mb-8 leading-tight">Join the future of Enterprise.</h1>
                    
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">🚀</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Instant Setup</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Deploy workspaces in seconds using our pre-configured templates.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-xl shrink-0">🛡️</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Bank-Grade Security</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">SOC2 Type II certified infrastructure ensuring your data is safe.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2 font-medium">Start your 30-day free trial. No credit card required.</p>
                    </div>

                    {success && (
                        <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-2xl border border-green-100 font-bold text-center animate-in fade-in slide-in-from-top-1">
                            ✓ Account created successfully! Redirecting...
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100 font-bold text-center animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#195bac] outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-400"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => handleFieldChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Company</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#195bac] outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-400"
                                    placeholder="Acme Inc"
                                    value={formData.company}
                                    onChange={e => handleFieldChange('company', e.target.value)}
                                />
                            </div>
                       </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                            <input
                                type="text"
                                required
                                className={`w-full px-5 py-4 rounded-xl bg-gray-50 border-2 ${fieldErrors.username ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#195bac]'} focus:bg-white outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-400`}
                                placeholder="johndoe77"
                                value={formData.username}
                                onChange={e => handleFieldChange('username', e.target.value)}
                                onBlur={e => handleFieldBlur('username', e.target.value)}
                            />
                            {fieldErrors.username && (
                                <p className="text-xs text-red-500 mt-1.5 ml-1 font-bold">{fieldErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
                            <input
                                type="email"
                                required
                                className={`w-full px-5 py-4 rounded-xl bg-gray-50 border-2 ${fieldErrors.email ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#195bac]'} focus:bg-white outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-400`}
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={e => handleFieldChange('email', e.target.value)}
                                onBlur={e => handleFieldBlur('email', e.target.value)}
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-red-500 mt-1.5 ml-1 font-bold">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className={`w-full px-5 py-4 rounded-xl bg-gray-50 border-2 ${fieldErrors.password ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#195bac]'} focus:bg-white outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-400`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => handleFieldChange('password', e.target.value)}
                                onBlur={e => handleFieldBlur('password', e.target.value)}
                            />
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500 mt-1.5 ml-1 font-bold">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl text-white font-black transition-all transform hover:-translate-y-0.5 shadow-xl shadow-blue-900/10 
                                  ${isSubmitting ? 'bg-[#11407a] opacity-80 cursor-wait' : 'bg-[#195bac] hover:bg-[#11407a] hover:shadow-[#195bac]/20'}`}
                            >
                                {isSubmitting ? 'Initializing Engine...' : 'Authorize Account'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account? <Link to="/login" className="text-[#195bac] font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>

         </div>
       </div>
    </div>
  );
}
