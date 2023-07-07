import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useRef } from "react";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import CptTest from "~/components/CptTest";

const Cpt: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const defaultBgRef = useRef("bg-slate-800");
  const [backgroundColor, setBackgroundColor] = useState(defaultBgRef.current);
  const [testHasFinished, setTestHasFinished] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <>
      <Head>
        <title>Taking Stroop Test</title>
        <meta name="description" content="Taking continous performance test" />
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap');`}
        </style>
      </Head>
      <main className={`h-screen ${backgroundColor}`}>
        <div
          style={{ height: "96vh" }}
          className="flex flex-col items-center justify-center text-slate-200"
        >
          <SignedIn>
            {userEmail && (
              <CptTest
                userEmail="userEmail"
                setBackgroundColor={setBackgroundColor}
                defaultBgColor={defaultBgRef.current}
                setTestHasFinished={setTestHasFinished}
              />
            )}
          </SignedIn>
          <SignedOut>
            <div className="flex h-5/6 flex-col items-center justify-center gap-4 text-justify text-slate-200">
              <p>Signed out, please sign in again.</p>
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

export default Cpt;
