import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginDoctor } from "../../api/authApi";


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    const response = await loginDoctor({
      email,
      password,
    });

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "doctor",
      JSON.stringify(response.data.doctor)
    );

    // Login successful
    navigate("/admin/dashboard");

  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "Invalid Email or Password"
    );
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

        <div className="mb-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Lock className="text-blue-600" size={34} />
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Doctor Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to your dashboard
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Mail
                className="text-slate-400"
                size={20}
              />

              <input
                type="email"
                className="w-full border-none bg-transparent p-4 outline-none"
                placeholder="doctor@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Password
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Lock
                className="text-slate-400"
                size={20}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="w-full border-none bg-transparent p-4 outline-none"
                placeholder="********"
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
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          <button
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>

          <div className="mt-5 text-right">

            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}