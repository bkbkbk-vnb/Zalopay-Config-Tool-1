import React, { useState } from 'react';
import { Lock, User, LogIn, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
    onLogin: (userData: { name: string; role: string; avatar?: string }) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth
        setTimeout(() => {
            onLogin({
                name: 'Admin User',
                role: 'Senior Product Manager',
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=006AF5&color=fff'
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center z-[100] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-[420px] p-8 relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <img src="/logos/zalopay_logo_v3.png" alt="ZaloPay" className="w-10 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">ZaloPay Config</h1>
                    <p className="text-slate-400 text-sm mt-1 text-center">Enter your credentials to access the tool</p>
                </div>

                {/* Login Card */}
                <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Work Email</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@zalopay.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-blue-500" />
                                Remember me
                            </label>
                            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">
                    <ShieldCheck size={12} />
                    Internal Use Only
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
