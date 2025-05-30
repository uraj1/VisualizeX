"use client";
import Link from "next/link";
import Quotes from "@/components/Quotes";
import { useEffect, useState, useRef } from "react";
import Toast from "@/components/toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/app/utils/schema";

export default function Page() {
  const [quote, setQuote] = useState<JSX.Element | null>(null);

  const [toast, setToast] = useState<boolean>(false);
  const [success, setSuccess] = useState<{
    success: boolean;
    warning: string;
  }>();

  //State for a single button
  const [clicked, setClicked] = useState<boolean>(false);

  const emailRef = useRef("");
  const passRef = useRef("");

  const router = useRouter();

  //Fixing Hydration Error
  useEffect(() => {
    setQuote(Quotes);
  }, []);

  const onSubmit = async () => {
    setClicked(true);
    const data = {
      email: emailRef.current,
      password: passRef.current,
    };
    try {
      if (signInSchema.parse(data)) {
        const result = await signIn("credentials", {
          email: emailRef.current,
          password: passRef.current,
          redirect: false,
          callbackUrl: "/dashboard",
        });
        if (!result?.ok) {
          setToast(true);
          setSuccess({
            success: false,
            warning: "Wrong Password/user doesn't exists",
          });
          setTimeout(() => setToast(false), 3000);
        } else {
          router.push("/dashboard");
        }

        setClicked(false);
      }
    } catch (e: any) {
      setToast(true);
      setSuccess({
        success: false,
        warning: "Check if email is valid or password is too short",
      });
      setTimeout(() => setToast(false), 3000);
      setClicked(false);
    }
  };

  const googleAuth = () => {
    signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <main className="lg:grid lg:grid-cols-2 bg-gray-900 h-screen flex justify-center items-center">
      {toast ? (
        <Toast
          success={success?.success as boolean}
          warning={success?.warning as string}
        />
      ) : null}

      <div className="hidden lg:block text-white text-3xl w-80 m-60 text-center">
        {quote}
      </div>
      <div className="flex flex-col h-screen justify-center items-center">
        <h2 className="text-white font-semibold text-xl">
          Log in to your VisualizeX account
        </h2>
        <h2 className=" text-gray-400 mt-3">
          Welcome back! Please enter your details.
        </h2>
        <div className="mt-8">
          <h2 className="text-white text-sm mb-2">Email</h2>
          <input
            onChange={(e) => (emailRef.current = e.target.value)}
            className="bg-gray-800 p-2 rounded-lg w-80 text-gray-300"
            type="email"
            placeholder="Email Address"
          />
          <h2 className="text-white text-sm mb-2 mt-3">Password</h2>
          <input
            onChange={(e) => (passRef.current = e.target.value)}
            className="bg-gray-800 p-2 rounded-lg w-80 text-gray-300"
            type="password"
            placeholder="Password"
          />
        </div>
        {!clicked ? (
          <button
            onClick={onSubmit}
            className=" bg-indigo-700 text-gray-200 p-2 rounded-xl mt-8 w-80 hover:bg-gray-600 hover:text-gray-300 transition-colors duration-300"
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center justify-center space-x-2 bg-indigo-700 p-4 rounded-xl mt-8 w-80 hover:bg-gray-600">
            <div className="w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
          </div>
        )}
          <button
            onClick={googleAuth}
            type="button"
            className="text-white bg-[#4285F4] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#4285F4]/55 me-0 mb-2 transition-colors duration-300 mt-2 w-80 rounded-xl"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19"
            >
              <path d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" />
            </svg>
            Sign in with Google
          </button>
        <h2 className="text-gray-500 text-sm mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            {" "}
            <span className="text-indigo-700 hover:underline cursor-pointer">
              Sign Up
            </span>
          </Link>
        </h2>
      </div>
    </main>
  );
}
