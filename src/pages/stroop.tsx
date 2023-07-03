import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import StroopTest from "src/components/StroopTest";
import { StroopContext } from "~/components/StroopContext";

type ResultSumItem = {
  trial: string;
  results: [
    {
      colorName: string;
      colorValue: string;
      response: string;
      responseTime: number;
    }
  ];
};

const Stroop: NextPage = () => {
  const [backgroundColor, setBackgroundColor] = useState("bg-slate-800");
  const [testHasFinished, setTestHasFinished] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const colors = ["red", "yellow", "green", "blue"];
  const [hasStarted, setHasStarted] = useState(false);
  const [response, setResponse] = useState("");
  const resultsRef = useRef(new Map<string, ResultSumItem["results"]>());
  const [hasResponded, setHasResponded] = useState(false); // This is used to restrict test taker to only respond once.
  const intervalLength = 1500 * 1; // Contols how quickly the colors switch. Measured in ms.
  const [currentColorName, setCurrentColorName] = useState("");
  const [currentColorValue, setCurrentColorValue] = useState("");
  const colorNameRef = useRef("");
  const colorValueRef = useRef("");
  const [loadComponent, setLoadComponent] = useState("start");
  const startTimeRef = useRef(0);
  const responseTimeRef = useRef(0);

  const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  const clearColors = () => {
    setCurrentColorName(() => {
      return "";
    });

    setCurrentColorValue(() => {
      return "";
    });
  };

  const stopTest = (testId: NodeJS.Timer | undefined) => {
    clearColors();

    clearInterval(testId);

    setHasStarted(false);
  };

  const handleResponse = (response: string) => {
    responseTimeRef.current = performance.now() - startTimeRef.current;

    setResponse(response);

    if (!resultsRef.current.has(loadComponent)) {
      resultsRef.current.set(loadComponent, [
        {
          colorName: colorNameRef.current,
          colorValue: colorValueRef.current,
          response: response,
          responseTime: responseTimeRef.current,
        },
      ]);
    } else {
      resultsRef.current.get(loadComponent)?.push({
        colorName: colorNameRef.current,
        colorValue: colorValueRef.current,
        response: response,
        responseTime: responseTimeRef.current,
      });
    }
  };

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
              <StroopContext.Provider
                value={{
                  loadComponent: loadComponent,
                  setLoadComponent: setLoadComponent,
                  colors: colors,
                  hasStarted: hasStarted,
                  setHasStarted: setHasStarted,
                  resultsRef: resultsRef,
                  hasResponded: hasResponded,
                  setHasResponded: setHasResponded,
                  intervalLength: intervalLength,
                  currentColorName: currentColorName,
                  setCurrentColorName: setCurrentColorName,
                  currentColorValue: currentColorValue,
                  setCurrentColorValue: setCurrentColorValue,
                  colorNameRef: colorNameRef,
                  colorValueRef: colorValueRef,
                  getRandomInt: getRandomInt,
                  clearColors: clearColors,
                  stopTest: stopTest,
                  handleResponse: handleResponse,
                  startTimeRef: startTimeRef,
                  responseTimeRef: responseTimeRef,
                  response: response,
                  setResponse: setResponse,
                }}
              >
                <StroopTest
                  defaultBgColor={backgroundColor}
                  userEmail={userEmail}
                  setBackgroundColor={setBackgroundColor}
                  setTestHasFinished={setTestHasFinished}
                />
              </StroopContext.Provider>
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
