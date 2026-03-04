import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setMessage(res.message);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 pb-20 pt-24 md:pt-32 min-h-screen bg-[#f8f9fc]">
       <div className="p-4 md:p-8 max-w-[1600px] mx-auto h-full"> 
         <div className="relative rounded-[40px] md:rounded-[60px] bg-white shadow-2xl shadow-blue-900/5 min-h-[85vh] overflow-hidden isolate flex items-center justify-center">
            
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[120px] -z-10 opacity-60"></div>

            <div className="w-full max-w-md p-8 relative z-10 animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-white rounded-[24px] shadow-xl shadow-blue-900/5 flex items-center justify-center mb-6 border border-gray-50">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Forgot Password</h1>
                    <p className="text-sm text-gray-500 font-medium">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-xl shadow-blue-900/5">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium text-center animate-in shake">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-xl border border-green-100 font-bold text-center animate-in fade-in">
                            {message}
                        </div>
                    )}

                    {!message && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#195bac] focus:shadow-lg focus:shadow-blue-500/10 outline-none text-sm font-bold text-gray-900 transition-all placeholder:font-medium placeholder:text-gray-400"
                                placeholder="you@company.com"
                                required
                                />
                            </div>
                        </div>
                    )}

                    {!message ? (
                        <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg shadow-[#195bac]/30 transition-all duration-300 relative overflow-hidden group
                            ${isLoading ? 'bg-[#195bac]/80 cursor-wait' : 'bg-[#195bac] hover:shadow-[#195bac]/50 hover:-translate-y-0.5'}`}
                        >
                        {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    ) : (
                         <div className="space-y-4">
                             <button
                                type="button"
                                onClick={() => navigate('/reset-password')} // Mock flow: Go to reset directly for demo
                                className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-sm tracking-wide shadow-lg transition-all hover:-translate-y-0.5"
                             >
                                Open Reset Page (Demo)
                             </button>
                         </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 text-center">
                        <Link to="/login" className="text-xs font-black text-gray-400 hover:text-[#195bac] transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>

         </div>
       </div>
    </div>
  );
}
