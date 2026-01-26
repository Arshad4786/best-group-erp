import { login } from "@/app/actions/auth";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Best Group ERP</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <form action={login} className="space-y-6 text-black">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                name="email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="admin@bestgroup.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                name="password"
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••"
              />
            </div>
          </div>

          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-bold transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}