"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Loader2, Github } from "lucide-react";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Verifique seu e-mail para o link de acesso!" });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6366944-624e-4690-8b1b-90f7a90f707b/BR-pt-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-20"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-lg bg-black/80 p-10 shadow-xl backdrop-blur-md"
      >
        <h1 className="mb-2 text-3xl font-bold text-white">Acessar Gameplex</h1>
        <p className="mb-8 text-sm text-zinc-500">Acesso via magic link ou Google. Sem cadastro necessário.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="email"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded bg-zinc-800 py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar Link Mágico"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-zinc-500">
          <div className="h-px flex-1 bg-zinc-800"></div>
          <span>ou</span>
          <div className="h-px flex-1 bg-zinc-800"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded bg-white py-3 font-bold text-black transition hover:bg-zinc-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Entrar com Google
        </button>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {message.text}
          </p>
        )}

        <p className="mt-8 text-sm text-zinc-500 text-center">
          Use seu e-mail ou Google para acessar suas listas e favoritos.
        </p>
      </motion.div>
    </div>
  );
}
