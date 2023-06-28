import { useState, useEffect, useRef } from "react";

import KeyboardInput from "./KeyboardInput";
import Countdown from "./Countdown";
import RenderTrial from "./RenderTrial";
import MatchingColors from "./MatchingColors";
import AnimatedInstructions from "src/components/AnimatedInstructions";

import {
  initialInstructions,
  keyboardInstructions,
  matchingTestInstructions,
} from "src/data/instructions";
import StartButton from "./StartButton";

type ResultsItem = {
  colorName: string;
  colorValue: string;
  response: string;
  responseTime: number;
};

const StroopTest = () => {
  // Map containing colors and corresponding RGB values
  const colors = ["red", "yellow", "green", "blue"];

  const [hasStarted, setHasStarted] = useState(false);

  const resultsRef = useRef<ResultsItem[]>([]);

  const startTimeRef = useRef(0);

  const responseTimeRef = useRef(0);

  const [hasResponded, setHasResponded] = useState(false); // This is used to restrict test taker to only respond once.

  // Contols how quickly the colors switch. Measured in ms.
  const intervalLength = 1000 * 1;

  // This needs an extra intervalLength to not shut down repsonses too early.
  const activeTestDuration = intervalLength + 1000 * 10;

  const warmUpDuration = intervalLength + 1000 * 10;

  const countDownLength = 1000 * 5;

  const [currentColorName, setCurrentColorName] = useState("");

  const [currentColorValue, setCurrentColorValue] = useState("");

  const [countDownTimer, setCountDownTimer] = useState(false);

  const colorNameRef = useRef("");

  const colorValueRef = useRef("");

  const handleStartButtonClick = () => {
    setCountDownTimer((state) => {
      return !state;
    });

    setTimeout(
      () =>
        setHasStarted((state) => {
          return !state;
        }),
      countDownLength
    );
  };

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

  // Sets the colorname and colorvalue to match
  const setHeteroColors = (colors: string[]) => {
    const randomValueIndex = getRandomInt(colors.length);
    let randomNameIndex = getRandomInt(colors.length);

    while (randomNameIndex === randomValueIndex) {
      randomNameIndex = getRandomInt(colors.length);
    }

    colorNameRef.current = colors[randomValueIndex]!;
    colorValueRef.current = colors[randomNameIndex]!;

    setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomValueIndex]!;
      }
    });

    setCurrentColorValue((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomNameIndex]!;
      }
    });
  };

  const stopTest = (testId: NodeJS.Timer | undefined) => {
    clearColors();

    clearInterval(testId);

    setHasStarted(false);
  };

  const runHeteroCondition = (): NodeJS.Timer | undefined => {
    if (hasStarted) {
      return setInterval(() => setHeteroColors(colors), intervalLength);
    } else {
      clearColors();
    }
    return undefined;
  };

  const handleResponse = (response: string) => {
    responseTimeRef.current = performance.now() - startTimeRef.current;

    resultsRef.current.push({
      colorName: colorNameRef.current,
      colorValue: colorValueRef.current,
      response: response,
      responseTime: responseTimeRef.current,
    });
  };

  // useEffect(() => {
  //   const runId = runHeteroCondition();

  //   const testRunId = setTimeout(() => stopTest(runId), activeTestDuration);

  //   return () => {
  //     // Log results
  //     if (hasStarted) {
  //       console.log("Results: ", resultsRef.current);
  //       resultsRef.current = []; // Reset data
  //     }

  //     clearInterval(runId);

  //     clearTimeout(testRunId);
  //   };
  // }, [hasStarted]);

  // Makes sure missed stimuli are logged.
  useEffect(() => {
    if (hasStarted && currentColorName === "" && !hasResponded) {
      handleResponse("");
      setHasResponded(true);
    }
  }, [currentColorName, hasResponded]);

  // Start response timer
  useEffect(() => {
    if (currentColorName !== "") {
      setHasResponded(false); // Reset response gate
      startTimeRef.current = performance.now();
    }
  }, [currentColorName]);

  const [loadComponent, setLoadComponent] = useState("initialInstructions");

  return (
    <div className="flex h-screen flex-col items-center justify-center text-slate-200">
      {/* On load, display initial instructions in the center of the screen. */}
      {loadComponent === "initialInstructions" && (
        <AnimatedInstructions
          load={"keyboardInstructions"}
          setLoadComponent={setLoadComponent}
          instructions={initialInstructions}
        />
      )}
      {loadComponent === "keyboardInstructions" && (
        <AnimatedInstructions
          load={"matchingColorWarmUpButton"}
          setLoadComponent={setLoadComponent}
          instructions={keyboardInstructions}
        />
      )}
      {loadComponent === "matchingColorWarmUpButton" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"matchingColorWarmUp"}
          startWhat="matching color warm up."
          setHasStarted={setHasStarted}
        />
      )}
      {loadComponent === "matchingColorWarmUp" && (
        <MatchingColors
          stopTest={stopTest}
          getRandomInt={getRandomInt}
          colorNameRef={colorNameRef}
          colorValueRef={colorValueRef}
          resultsRef={resultsRef}
          setCurrentColorName={setCurrentColorName}
          setCurrentColorValue={setCurrentColorValue}
          hasStarted={hasStarted}
          colors={colors}
          intervalLength={intervalLength}
          activeTestDuration={warmUpDuration}
          clearColors={clearColors}
          setHasResponded={setHasResponded}
          hasResponded={hasResponded}
          handleResponse={handleResponse}
          currentColorValue={currentColorValue}
          currentColorName={currentColorName}
          setLoadComponent={setLoadComponent}
          load={"matchingColorTestButton"}
        />
      )}
      {loadComponent === "matchingColorTestButton" && (
        <AnimatedInstructions
          load={"startFirstTest"}
          setLoadComponent={setLoadComponent}
          instructions={matchingTestInstructions}
        />
      )}
      {loadComponent === "startFirstTest" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"matchingColorTest"}
          startWhat="matching color test."
          setHasStarted={setHasStarted}
        />
      )}
      {loadComponent === "matchingColorTest" && (
        <MatchingColors
          stopTest={stopTest}
          getRandomInt={getRandomInt}
          colorNameRef={colorNameRef}
          colorValueRef={colorValueRef}
          resultsRef={resultsRef}
          setCurrentColorName={setCurrentColorName}
          setCurrentColorValue={setCurrentColorValue}
          hasStarted={hasStarted}
          colors={colors}
          intervalLength={intervalLength}
          activeTestDuration={activeTestDuration}
          clearColors={clearColors}
          setHasResponded={setHasResponded}
          hasResponded={hasResponded}
          handleResponse={handleResponse}
          currentColorValue={currentColorValue}
          currentColorName={currentColorName}
          setLoadComponent={setLoadComponent}
          load={"mismatchColorTextInstruction"}
        />
      )}
    </div>
  );
};

export default StroopTest;
