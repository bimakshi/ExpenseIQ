"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", { 
      email,
      password,
      redirect: false, 
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard"); // Redirect to dashboard on successful login
    router.refresh();
  }

  return (
    <main className="eq-auth-page">
      <div className="eq-auth-shell">
        <div className="eq-auth-heading">
          <Link href="/" className="eq-auth-brand">
            Expense<span>IQ</span>
          </Link>

          <h1 className="eq-auth-title">
            Welcome back
          </h1>

          <p className="eq-auth-description">
            Sign in to continue to your account.
          </p>
        </div>

        <div className="eq-auth-card">
          <form onSubmit={handleSubmit} className="eq-auth-form">
            <div className="eq-field">
              <label htmlFor="email" className="eq-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="eq-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="eq-field">
              <label htmlFor="password" className="eq-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="eq-input"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="eq-alert-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="eq-btn-primary w-full"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="eq-auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="eq-auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
