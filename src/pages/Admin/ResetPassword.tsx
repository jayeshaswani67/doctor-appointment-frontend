import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { resetPassword } from "../../api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();

  const { userId, token } = useParams<{
    userId: string;
    token: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!token || !userId) {
      alert("Invalid or expired reset link.");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(
        userId,
        token,
        password
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* New Password */}
          <div className="flex items-center rounded-xl border px-4">
            <Lock className="text-gray-500" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              className="w-full p-4 outline-none"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff />
              ) : (
                <Eye />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center rounded-xl border px-4">
            <Lock className="text-gray-500" />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              className="w-full p-4 outline-none"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <EyeOff />
              ) : (
                <Eye />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}