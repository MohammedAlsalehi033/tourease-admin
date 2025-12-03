"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (res?.error) {
        setError("Invalid credentials. Access denied.");
      } else if (res?.ok) {
        router.push("/");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg border border-border">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
        Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
        {/* Email Field */}
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="block w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full rounded-lg border border-input bg-background py-3 pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
          </div>

          {error && (
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive text-center">{error}</p>
        </div>
          )}

          <button
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center">
           <p className="text-xs text-muted-foreground">
         Don&apos;t have an account? <Link href="/signup" className="text-primary hover:text-primary/80 hover:underline transition-colors">Request Access</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
