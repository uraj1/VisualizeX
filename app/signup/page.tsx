"use client";
import Link from "next/link";
import Quotes from "@/components/Quotes";
import { useEffect, useRef, useState } from "react";
import { signup } from "../actions/user";
import { signIn } from "next-auth/react";
import Toast from "@/components/toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/app/utils/schema";

export default function Page() {
  const router = useRouter()
  const [quote, setQuote] = useState<JSX.Element | null>(null);
  const [toast, setToast] = useState<boolean>(false);
  const [success, setSuccess] = useState<{
    success: boolean;
    warning: string;
  }>();

  //State for a single button
  const [clicked, setClicked] = useState<boolean>(false);

  const nameRef = useRef("")
  const emailRef = useRef("")
  const passRef = useRef("")

  //Fixing Hydration Error
  useEffect(() => {
    setQuote(Quotes);
  }, []);

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
      <div className="hidden lg:flex flex-col items-center h-screen justify-center text-white text-3xl w-96 max-h-24 m-60 text-center">
        {quote}
      </div>
      <div className="flex flex-col items-center h-screen justify-center">
        <h2 className="text-white font-semibold text-xl">
          Create a VisualizeX account
        </h2>
        <h2 className=" text-gray-400 mt-3">
          Welcome! Please enter your details.
        </h2>
        <div className="my-8">
          <h2 className="text-white text-sm mb-2">Name</h2>
          <input
            onChange={(e) => nameRef.current = e.target.value}
            className="bg-gray-800 p-2 rounded-lg w-80 text-gray-300"
            type="text"
            placeholder="Name"
          />
          <h2 className="text-white text-sm mb-2 mt-3">Email</h2>
          <input
            onChange={(e) => emailRef.current = e.target.value}
            className="bg-gray-800 p-2 rounded-lg w-80 text-gray-300"
            type="email"
            placeholder="Email Address"
          />
          <h2 className="text-white text-sm mb-2 mt-3">Password</h2>
          <input
            onChange={(e) => passRef.current = e.target.value}
            className="bg-gray-800 p-2 rounded-lg w-80 text-gray-300"
            type="password"
            placeholder="Password"
          />
        </div>
        {!clicked ? (
          <button
            onClick={async () => {
              //Check if form fields are missing
              const data = {
                name: nameRef.current,
                email: emailRef.current,
                password: passRef.current
              }
              try{
                if(signUpSchema.parse(data)){
                  setClicked(true);
                  const token = await signup(nameRef.current, emailRef.current, passRef.current);
                  if (token) {
                    setToast(true);
                    setSuccess({
                      success: true,
                      warning: "Successfully signed up",
                    });
                    setTimeout(() => setToast(false), 3000);
                    router.push("/signin")
                  } else {
                    setToast(true);
                    setSuccess({
                      success: false,
                      warning: "Email ID is already taken",
                    });
                    setTimeout(() => setToast(false), 3000);
                  }
                  setClicked(false);
                }
              }
              catch(e){
                setToast(true);
                setSuccess({
                  success: false,
                  warning: "Please check if email is valid and password length",
                });
                setTimeout(() => setToast(false), 3000);
              }
              setClicked(false);
            }}
            className=" bg-indigo-700 text-gray-200 p-2 rounded-xl w-80 hover:bg-gray-600 hover:text-gray-300 transition-colors duration-300"
          >
            Sign Up
          </button>
        ) : (
          <div className="flex items-center justify-center space-x-2 bg-indigo-700 p-4 rounded-xl w-80 hover:bg-gray-600">
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
            Sign up with Google
          </button>

        <h2 className="text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link href="/signin">
            {" "}
            <span className="text-indigo-700 hover:underline cursor-pointer">
              Sign In
            </span>
          </Link>
        </h2>
      </div>
    </main>
  );
}
