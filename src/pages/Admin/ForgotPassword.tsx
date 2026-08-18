import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    setEmailError("");
    return true;
  };

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await forgotPassword(email);

      toast.success(
        "Success! We've sent the reset link to your email. Please check your inbox to continue."
      );

      setEmail("");

      console.log(res.data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ??
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold">
          Forgot Password
        </h1>

        <p className="mt-2 text-slate-500">
          Enter your registered email address to
          receive a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <div
              className={`flex items-center rounded-xl border px-4 ${
                emailError
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <Mail className="text-slate-400" />

              <input
                className="w-full p-4 outline-none"
                placeholder="doctor@gmail.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (emailError) {
                    setEmailError("");
                  }
                }}
              />
            </div>

            {emailError && (
              <p className="mt-2 text-sm text-red-500">
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}