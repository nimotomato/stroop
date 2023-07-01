import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import StroopTest from "src/components/StroopTest";

const Stroop: NextPage = () => {
  const [backgroundColor, setBackgroundColor] = useState("bg-slate-800");
  const [testHasFinished, setTestHasFinished] = useState(false);

  const { user } = useUser();
  const router = useRouter();
  const defaultBgColor = "bg-slate-800";

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (testHasFinished) {
      router
        .push("/")
        .then(() => {
          console.log();
        })
        .catch((e) => console.error(e));
    }
  });

  return (
    <>
      <Head>
        <title>Taking Stroop Test</title>
        <meta name="description" content="Taking stroop test" />
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
              <StroopTest
                defaultBgColor="defaultBgColor"
                userEmail={userEmail}
                setBackgroundColor={setBackgroundColor}
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

export default Stroop;
