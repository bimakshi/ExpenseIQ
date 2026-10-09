"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="eq-auth-page">
      <div className="eq-auth-shell">
        <div className="eq-auth-heading">
          <Link href="/" className="eq-auth-brand">
            Expense<span>IQ</span>
          </Link>

          <h1 className="eq-auth-title">
            Create your account
          </h1>

          <p className="eq-auth-description">
            Start tracking your expenses with ExpenseIQ.
          </p>
        </div>

        <div className="eq-auth-card">
          <form onSubmit={handleSubmit} className="eq-auth-form">
            <div className="eq-field">
              <label htmlFor="name" className="eq-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="eq-input"
                placeholder="Your name"
              />
            </div>

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
                minLength={8}
                autoComplete="new-password"
                className="eq-input"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="eq-field">
              <label htmlFor="confirmPassword" className="eq-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="eq-input"
                placeholder="Re-enter your password"
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
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="eq-auth-footer">
          Already have an account?{" "}
          <Link href="/login" className="eq-auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
