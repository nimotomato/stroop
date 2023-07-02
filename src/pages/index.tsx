import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

import UserDetailsForm from "src/components/UserDetailsForm";

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const Home: NextPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const router = useRouter();

  const defaultBgColor = "bg-slate-800";

  return (
    <>
      <Head>
        <title>Stroop</title>
        <meta name="description" content="Stroop" />
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap');`}
        </style>
      </Head>
      <main className={`h-screen ${defaultBgColor}`}>
        <div
          style={{ height: "96vh" }}
          className="flex flex-col text-slate-200"
        >
          <SignedIn>
            <div className="m-4 flex flex-col items-end justify-end">
              <div className="btn p-1 text-sm">
                <SignOutButton />
              </div>
            </div>
            <br />
            {!isRegistered && (
              <UserDetailsForm setIsRegistered={setIsRegistered} />
            )}
            {isRegistered && (
              <div className="disable-select flex h-4/6 flex-col items-center justify-center">
                <h2 className="m-4 ">Choose a test to take!</h2>
                <div className="w-16">
                  <button
                    className="btn"
                    onClick={() => {
                      router
                        .push("/stroop")
                        .then(() => {
                          console.log();
                        })
                        .catch((e) => console.error(e));
                      return;
                    }}
                  >
                    <span className="text-yellow-300">s</span>
                    <span className="text-red-600">t</span>
                    <span className="text-blue-600">r</span>
                    <span className="text-green-600">o</span>
                    <span className="text-yellow-300">o</span>
                    <span className="text-red-600">p</span>
                  </button>
                </div>
              </div>
            )}
          </SignedIn>
          <SignedOut>
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: "96vh" }}
            >
              <div className="flex h-5/6 flex-col items-center justify-center gap-4 text-justify text-slate-200">
                <h1 className="flex justify-center text-6xl uppercase">
                  <span className="text-yellow-300">s</span>
                  <span className="text-red-600">t</span>
                  <span className="text-blue-600">r</span>
                  <span className="text-green-600">o</span>
                  <span className="text-yellow-300">o</span>
                  <span className="text-red-600">p</span>
                </h1>
                <div className="flex h-1/3 flex-col items-center justify-center text-sm">
                  <p className="w-2/6 pb-2">
                    Welcome to this online stroop test!
                  </p>
                  <p className="w-2/6 ">
                    To use it, you must first sign in and then fill out some
                    basic user data.
                  </p>
                  <div className="btn mt-4">
                    <SignInButton />
                  </div>
                </div>
              </div>
            </div>
          </SignedOut>
        </div>
        <footer className="pl-2 text-xs">
          dummy email: stroopinfo@mailfence.com
        </footer>
      </main>
    </>
  );
};

export default Home;
