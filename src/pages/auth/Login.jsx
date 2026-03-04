import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'admin', name: 'Admin', icon: '⚡', desc: 'Full System Access', user: 'admin', pass: 'admin123' },
    { id: 'hr', name: 'HR', icon: '👥', desc: 'Human Resources', user: 'hr', pass: 'password' },
    { id: 'sales', name: 'Sales', icon: '💰', desc: 'Sales & CRM', user: 'sales', pass: 'password' },
    { id: 'finance', name: 'Finance', icon: '📈', desc: 'Accounts & Taxes', user: 'finance', pass: 'password' },
    { id: 'ops', name: 'Ops', icon: '⚙️', desc: 'Operations & Inventory', user: 'ops', pass: 'password' },
  ];

  const handleQuickLogin = (role) => {
    setUsername(role.user);
    setPassword(role.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32 min-h-screen bg-[#f8f9fc]">
       <div className="p-4 md:p-8 max-w-[1600px] mx-auto h-full"> 
         <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[85vh] overflow-hidden isolate flex items-center justify-center">
            
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-100 rounded-full blur-[120px] -z-10 opacity-60"></div>

            <div className="w-full max-w-md p-8 relative z-10 animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-white rounded-[24px] shadow-xl shadow-blue-900/5 flex items-center justify-center mb-6 border border-gray-50">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-sm text-gray-500 font-medium">Sign in to your enterprise workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-xl shadow-blue-900/5">
                    {/* Access Based Selection */}
                    <div className="mb-6">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Quick Access Roles</label>
                        <div className="grid grid-cols-5 gap-2">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => handleQuickLogin(r)}
                                    className={`group flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-300 ${
                                        username === r.user 
                                        ? 'bg-[#195bac] border-[#195bac] shadow-lg shadow-blue-500/20' 
                                        : 'bg-gray-50/50 border-gray-100 hover:border-blue-200 hover:bg-white'
                                    }`}
                                >
                                    <span className={`text-xl mb-1 group-hover:scale-125 transition-transform duration-300 ${username === r.user ? '' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                                        {r.icon}
                                    </span>
                                    <span className={`text-[8px] font-black uppercase tracking-tighter ${username === r.user ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                        {r.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium text-center animate-in shake">
                        {error}
                    </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username or Email</label>
                            <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#195bac] focus:shadow-lg focus:shadow-blue-500/10 outline-none text-sm font-bold text-gray-900 transition-all placeholder:font-medium placeholder:text-gray-400"
                            placeholder="user@company.com"
                            required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#195bac] focus:shadow-lg focus:shadow-blue-500/10 outline-none text-sm font-bold text-gray-900 transition-all placeholder:font-medium placeholder:text-gray-400 pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#195bac] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#195bac] focus:ring-[#195bac] transition-all cursor-pointer accent-[#195bac]"
                        />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-xs font-black text-[#195bac] hover:underline">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg shadow-[#195bac]/30 transition-all duration-300 relative overflow-hidden group
                            ${isLoading ? 'bg-[#195bac]/80 cursor-wait' : 'bg-[#195bac] hover:shadow-[#195bac]/50 hover:-translate-y-0.5'}`}
                    >
                    {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>

         </div>
       </div>
    </div>
  );
}
