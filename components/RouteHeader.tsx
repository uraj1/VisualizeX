import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Header(path: string, session: any) {
  return (
    <header className="bg-gray-900">
      <div className="flex justify-center sm:justify-between px-10 pt-3">
        <Link href="/">
          <div className="">
            <h2 className="text-white text-2xl font-semibold cursor-pointer">
              VisualizeX{" "}
              <span className="cursor-default bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
                {path}
              </span>
            </h2>
            <h2 className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-600">
              Explore Your Data&apos;s Journey
            </h2>
          </div>
        </Link>
        <nav>
          {session ? (
            <div
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: "/",
                })
              }
              className="size-14 sm:hidden cursor-pointer pl-5 hover:animate-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="18px"
                viewBox="0 0 100 125"
                style={{ fill: "red" }}
              >
                <g>
                  <path d="M78.77,51.66c0.05-0.07,0.08-0.14,0.11-0.21c0.06-0.1,0.12-0.2,0.16-0.3c0.04-0.1,0.06-0.2,0.09-0.29   c0.03-0.09,0.06-0.17,0.08-0.27c0.08-0.39,0.08-0.79,0-1.17c-0.02-0.09-0.05-0.17-0.08-0.26c-0.03-0.1-0.05-0.2-0.09-0.3   c-0.04-0.1-0.1-0.2-0.16-0.3c-0.04-0.07-0.07-0.15-0.12-0.22c-0.11-0.17-0.24-0.32-0.38-0.46L66.26,35.74   c-1.17-1.17-3.07-1.17-4.24,0c-1.17,1.17-1.17,3.07,0,4.24L69.03,47H37.8c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3h31.23l-7.02,7.02   c-1.17,1.17-1.17,3.07,0,4.24c0.59,0.59,1.35,0.88,2.12,0.88c0.77,0,1.54-0.29,2.12-0.88l12.13-12.13   C78.53,51.98,78.66,51.83,78.77,51.66z" />
                  <g>
                    <path d="M54.03,76.34h-30.3c-1.66,0-3-1.34-3-3V26.66c0-1.66,1.34-3,3-3h30.3c1.66,0,3,1.34,3,3s-1.34,3-3,3h-27.3v40.68h27.3    c1.66,0,3,1.34,3,3S55.69,76.34,54.03,76.34z" />
                  </g>
                </g>
              </svg>
            </div>
          ) : null}

          <ul className="hidden pt-2 text-white sm:flex gap-6">
            {!session ? (
              <li className="bg-white text-md bg-clip-text text-transparent cursor-pointer hover:bg-gradient-to-r from-red-500 to-indigo-600">
                {" "}
                <Link href="/signin">Sign In</Link>{" "}
              </li>
            ) : null}
            <li className="bg-white text-md bg-clip-text text-transparent cursor-pointer hover:bg-gradient-to-r from-red-500 to-indigo-600">
              {" "}
              <Link href="/docs">Docs</Link>{" "}
            </li>
            <li className="bg-white text-md bg-clip-text text-transparent cursor-pointer hover:bg-gradient-to-r from-red-500 to-indigo-600">
              Github
            </li>
            <li className="bg-white text-md bg-clip-text text-transparent cursor-pointer hover:bg-gradient-to-r from-red-500 to-indigo-600">
              {" "}
              <Link href="/about">About</Link>{" "}
            </li>
            {session ? (
              <li
                onClick={() =>
                  signOut({
                    redirect: true,
                    callbackUrl: "/",
                  })
                }
                className=" text-gray-300 text-md cursor-pointer hover:text-red-400"
              >
                {" "}
                Signout{" "}
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  );
}
