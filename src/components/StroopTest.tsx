import { useEffect, useRef, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

import MatchingColors from "./MatchingColors";
import MisMatchingColors from "./MisMatchingColors";
import AnimatedInstructions from "src/components/AnimatedInstructions";
import StartButton from "./StartButton";
import ShowResults from "./ShowResults";
import { StroopContext } from "./StroopContext";

import { api } from "src/utils/api";
import { i } from "src/data/instructions";

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

interface Props {
  defaultBgColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  setTestHasFinished: Dispatch<SetStateAction<boolean>>;
  userEmail: string;
}

const StroopTest = (props: Props) => {
  const ctx = useContext(StroopContext)!;

  // This needs an extra intervalLength to not shut down responses too early.
  const activeTestDuration = ctx.intervalLength + 1500 * 60;

  const warmUpDuration = ctx.intervalLength + 1500 * 12;

  const errorFlashColor = "bg-red-500";

  const flashTime = 75;

  const errorsRef = useRef(0);

  // Sends test data to database
  const sendData = api.test.sendData.useMutation();

  // Flash when incorrect response during warm up
  // Also temp store of errors for trial results
  useEffect(() => {
    const handleErrors = (response: string) => {
      if (!ctx.hasStarted || !ctx.hasResponded || response === "") return;

      const currentTrial = ctx.loadComponent;

      // These just add to local error counter
      if (
        (currentTrial === "test-1" || currentTrial === "test-2") &&
        ctx.colorNameRef.current !== response
      ) {
        errorsRef.current += 1;
      } else if (
        currentTrial === "test-3" &&
        ctx.colorValueRef.current !== response
      ) {
        errorsRef.current += 1;
      }

      // Warmup makes screen go red but doesn't log error
      if (
        (currentTrial === "warmUp-1" || currentTrial === "warmUp-2") &&
        ctx.colorNameRef.current !== response
      ) {
        props.setBackgroundColor(errorFlashColor);

        setTimeout(
          () => props.setBackgroundColor(props.defaultBgColor),
          flashTime
        );
      } else if (
        currentTrial === "warmUp-3" &&
        ctx.colorValueRef.current !== response
      ) {
        props.setBackgroundColor(errorFlashColor);

        setTimeout(
          () => props.setBackgroundColor(props.defaultBgColor),
          flashTime
        );
      }
    };

    handleErrors(ctx.response);
  }, [ctx.hasResponded]);

  useEffect(() => {
    // Sends results to DB
    if (ctx.loadComponent === "end") {
      if (
        !ctx.resultsRef.current ||
        ctx.resultsRef.current.size === 0 ||
        props.userEmail === ""
      )
        return;

      const results: ResultSumItem[] = [];

      ctx.resultsRef.current.forEach(
        (
          value: [
            {
              colorName: string;
              colorValue: string;
              response: string;
              responseTime: number;
            }
          ],
          key: string
        ) => {
          const myObj: ResultSumItem = { trial: key, results: value };

          results.push(myObj);
        }
      );

      sendData.mutate({
        testScore: results,
        testTaker: props.userEmail,
      });
    }

    // Clears results
    if (ctx.loadComponent === "start") {
      ctx.resultsRef.current.clear();
    }
  }, [ctx.loadComponent]);

  // Makes sure missed stimuli are logged.
  useEffect(() => {
    if (ctx.hasStarted && ctx.currentColorName === "" && !ctx.hasResponded) {
      ctx.handleResponse("");
      ctx.setHasResponded(true);
      errorsRef.current += 1;
    }
  }, [ctx.currentColorName, ctx.hasResponded]);

  // Start response timer
  useEffect(() => {
    if (ctx.currentColorName !== "") {
      ctx.setHasResponded(false); // Reset response gate
      ctx.startTimeRef.current = performance.now();
    }
  }, [ctx.currentColorName]);

  if (ctx.loadComponent === "") {
    props.setTestHasFinished(true);
    return null;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center text-slate-200">
      {/* On load, display initial instructions in the center of the screen. */}
      {ctx.loadComponent === "start" && (
        <AnimatedInstructions
          instructions={i.initialInstructions}
          load={"warmUpButton-1"}
        />
      )}
      {/* Start button for warm up */}
      {ctx.loadComponent === "warmUpButton-1" && (
        <StartButton
          setLoadComponent={ctx.setLoadComponent}
          load={"warmUp-1"}
          startWhat="matching color warm up"
          setHasStarted={ctx.setHasStarted}
        />
      )}
      {/* Start warm up */}
      {ctx.loadComponent === "warmUp-1" && (
        <MatchingColors
          activeTestDuration={warmUpDuration}
          load={"testInstructions-1"}
        />
      )}
      {/* Instructions for the first test */}
      {ctx.loadComponent === "testInstructions-1" && (
        <AnimatedInstructions
          load={"testButton-1"}
          instructions={i.matchingTestInstructions}
        />
      )}
      {/* Start button for first test */}
      {ctx.loadComponent === "testButton-1" && (
        <StartButton
          setLoadComponent={ctx.setLoadComponent}
          load={"test-1"}
          startWhat="matching color test"
          setHasStarted={ctx.setHasStarted}
        />
      )}
      {/* First test */}
      {ctx.loadComponent === "test-1" && (
        <MatchingColors
          activeTestDuration={activeTestDuration}
          load={"warmUpInstruction-2"}
        />
      )}
      {/* Second test instructions */}
      {ctx.loadComponent === "warmUpInstruction-2" && (
        <AnimatedInstructions
          load={"warmUpButton-2"}
          instructions={i.mismatchColorTextInstruction}
        />
      )}
      {/* Start button for second warm up */}
      {ctx.loadComponent === "warmUpButton-2" && (
        <StartButton
          setLoadComponent={ctx.setLoadComponent}
          load={"warmUp-2"}
          startWhat="color text warm up"
          setHasStarted={ctx.setHasStarted}
        />
      )}
      {/* Second warm up */}
      {ctx.loadComponent === "warmUp-2" && (
        <MisMatchingColors
          activeTestDuration={warmUpDuration}
          load={"testInstructions-2"}
        />
      )}
      {/* Second test instructions repeat */}
      {ctx.loadComponent === "testInstructions-2" && (
        <AnimatedInstructions
          load={"testButton-2"}
          instructions={i.mismatchColorTextInstructionRepeat}
        />
      )}
      {/* Second test start button */}
      {ctx.loadComponent === "testButton-2" && (
        <StartButton
          setLoadComponent={ctx.setLoadComponent}
          load={"test-2"}
          startWhat="color text test"
          setHasStarted={ctx.setHasStarted}
        />
      )}
      {/* Second test */}
      {ctx.loadComponent === "test-2" && (
        <MisMatchingColors
          activeTestDuration={activeTestDuration}
          load={"warmUpInstructions-3"}
        />
      )}
      {/* Third test instructions */}
      {ctx.loadComponent === "warmUpInstructions-3" && (
        <AnimatedInstructions
          load={"warmUpButton-3"}
          instructions={i.mismatchColorValueInstruction}
        />
      )}
      {/* Third warm up start button*/}
      {ctx.loadComponent === "warmUpButton-3" && (
        <StartButton
          setLoadComponent={ctx.setLoadComponent}
          load={"warmUp-3"}
          startWhat="font color warm up"
          setHasStarted={ctx.setHasStarted}
        />
      )}
      {/* Third warm up*/}
      {ctx.loadComponent === "warmUp-3" && (
        <MisMatchingColors
          activeTestDuration={warmUpDuration}
          load={"testInstructions-3"}
        />
      )}
      {/* Third test instruction repeat*/}
      {ctx.loadComponent === "testInstructions-3" && (
        <AnimatedInstructions
          load={"testButton-3"}
          instructions={i.mismatchColorValueInstructionRepeat}
        />
      )}
      {/* Third test start button*/}
      {ctx.loadComponent === "testButton-3" && (
        <StartButton
          setLoadComponent={ctx.setLoadComponent}
          load={"test-3"}
          startWhat="font color test"
          setHasStarted={ctx.setHasStarted}
        />
      )}
      {/* Third test*/}
      {ctx.loadComponent === "test-3" && (
        <MisMatchingColors
          activeTestDuration={activeTestDuration}
          load={"end"}
        />
      )}
      {/* End text */}
      {ctx.loadComponent === "end" && (
        <div>
          <ShowResults resultsRef={ctx.resultsRef} errorsRef={errorsRef} />
          <AnimatedInstructions load={""} instructions={i.endInstruction} />
        </div>
      )}
    </div>
  );
};

export default StroopTest;
