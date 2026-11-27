'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, User, Mail, Eye, EyeOff } from "lucide-react";

interface StoredUser {
  name: string;
  email: string;
  password?: string;
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [wantChangePassword, setWantChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("as_user");
      if (raw) {
        const parsed: StoredUser = JSON.parse(raw);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.name) setName(parsed.name);
      }
    } catch {
      // ignora erro de leitura do localStorage
    }
  }, []);

  const readSavedUsers = (): Record<string, StoredUser> => {
    try {
      const raw = localStorage.getItem("as_users");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (!name || !email || !password) return setError("Preencha todos os campos");
      const users = readSavedUsers();
      users[email.toLowerCase()] = { name, email, password };
      localStorage.setItem("as_users", JSON.stringify(users));
      localStorage.setItem("as_user", JSON.stringify({ name, email, password }));
      router.push("/");
      return;
    }

    if (!email || !password) return setError("Preencha todos os campos");

    const users = readSavedUsers();
    const existing = users[email.toLowerCase()];
    const resolvedName = existing?.name || email.split("@")[0];

    if (wantChangePassword) {
      if (!newPassword) {
        return setError("Informe a nova senha ou desmarque a alteração de senha");
      }
      if (newPassword.length < 6) {
        return setError("A nova senha deve ter pelo menos 6 caracteres");
      }
      if (existing?.password && currentPassword !== existing.password) {
        return setError("Senha atual incorreta");
      }

      const updatedUser: StoredUser = {
        name: resolvedName,
        email,
        password: newPassword,
      };
      users[email.toLowerCase()] = updatedUser;
      localStorage.setItem("as_users", JSON.stringify(users));
      localStorage.setItem("as_user", JSON.stringify(updatedUser));
      setPassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setWantChangePassword(false);
      setSuccess("Senha atualizada com sucesso");
      return;
    }

    localStorage.setItem("as_user", JSON.stringify({ name: resolvedName, email }));
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-as-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-6">
        </Link>

        <div className="bg-as-gray rounded-2xl p-8">
          <div className="text-center mb-6">
            <User className="mx-auto text-as-green mb-2" size={48} />
            <h1 className="text-2xl font-black">{mode === "login" ? "Entrar" : "Criar Conta"}</h1>
            <p className="text-as-gray-light text-sm">{mode === "login" ? "Acesse sua conta Asstore" : "Cadastre-se e ganhe 10% OFF"}</p>
          </div>

          {error && <div className="bg-red-500/10 text-red-400 p-2 rounded mb-4 text-sm text-center">{error}</div>}
          {success && <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded mb-4 text-sm text-center">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border border-as-gray">
                <User size={18} className="text-as-gray-light shrink-0" />
                <input type="text" placeholder="Nome completo" className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-as-gray-light" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border border-as-gray">
              <Mail size={18} className="text-as-gray-light shrink-0" />
              <input type="email" placeholder="E-mail" className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-as-gray-light" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border border-as-gray">
              <Lock size={18} className="text-as-gray-light shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-as-gray-light"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="text-as-gray-light hover:text-white ml-2 shrink-0"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mode === "login" && (
              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-as-gray-light cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantChangePassword}
                    onChange={(e) => {
                      setWantChangePassword(e.target.checked);
                      setError("");
                      setSuccess("");
                    }}
                    className="rounded accent-as-green"
                  />
                  Quero alterar minha senha
                </label>

                {wantChangePassword && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-black/30">
                    <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border border-as-gray">
                      <Lock size={18} className="text-as-gray-light shrink-0" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Senha atual"
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-as-gray-light"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        aria-label={showCurrentPassword ? "Ocultar senha atual" : "Mostrar senha atual"}
                        className="text-as-gray-light hover:text-white ml-2 shrink-0"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border border-as-gray">
                      <Lock size={18} className="text-as-gray-light shrink-0" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-as-gray-light"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        aria-label={showNewPassword ? "Ocultar nova senha" : "Mostrar nova senha"}
                        className="text-as-gray-light hover:text-white ml-2 shrink-0"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-2">
              {mode === "login"
                ? (wantChangePassword ? "Salvar nova senha" : "Entrar")
                : "Criar Conta"}
            </button>
          </form>

          <p className="text-center text-sm text-as-gray-light mt-4">
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setWantChangePassword(false);
                setError("");
                setSuccess("");
              }}
              className="text-as-green font-bold"
            >
              {mode === "login" ? "Cadastre-se" : "Entre"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}