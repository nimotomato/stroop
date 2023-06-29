import { useState, useEffect, useRef } from "react";

import KeyboardInput from "./KeyboardInput";
import Countdown from "./Countdown";
import RenderTrial from "./RenderTrial";
import MatchingColors from "./MatchingColors";
import MisMatchingColors from "./MisMatchingColors";
import AnimatedInstructions from "src/components/AnimatedInstructions";

import {
  initialInstructions,
  keyboardInstructions,
  matchingTestInstructions,
  mismatchColorTextInstruction,
  mismatchColorValueInstruction,
  endInstruction,
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

  const stopTest = (testId: NodeJS.Timer | undefined) => {
    clearColors();

    clearInterval(testId);

    setHasStarted(false);
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

  if (loadComponent === "") return null;

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
      {loadComponent === "mismatchColorTextInstruction" && (
        <AnimatedInstructions
          load={"mismatchColorWarmupButton"}
          setLoadComponent={setLoadComponent}
          instructions={mismatchColorTextInstruction}
        />
      )}
      {loadComponent === "mismatchColorWarmupButton" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"misMatchColorWarmup"}
          startWhat="matching color warm up."
          setHasStarted={setHasStarted}
        />
      )}
      {loadComponent === "misMatchColorWarmup" && (
        <MisMatchingColors
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
          load={"misMatchColorInstruction"}
        />
      )}
      {loadComponent === "misMatchColorInstruction" && (
        <AnimatedInstructions
          load={"startMisMatchTestButton"}
          setLoadComponent={setLoadComponent}
          instructions={matchingTestInstructions}
        />
      )}
      {loadComponent === "startMisMatchTestButton" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"misMatchColorTest"}
          startWhat="matching color test."
          setHasStarted={setHasStarted}
        />
      )}
      {loadComponent === "misMatchColorTest" && (
        <MisMatchingColors
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
          load={"misMatchColorValueInstruction"}
        />
      )}
      {loadComponent === "misMatchColorValueInstruction" && (
        <AnimatedInstructions
          load={"mismatchColorValueWarmupButton"}
          setLoadComponent={setLoadComponent}
          instructions={mismatchColorValueInstruction}
        />
      )}
      {loadComponent === "mismatchColorValueWarmupButton" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"misMatchColorValueWarmup"}
          startWhat="matching color warm up."
          setHasStarted={setHasStarted}
        />
      )}
      {loadComponent === "misMatchColorValueWarmup" && (
        <MisMatchingColors
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
          load={"misMatchColorValueInstruction"}
        />
      )}
      {loadComponent === "misMatchColorValueInstruction" && (
        <AnimatedInstructions
          load={"startMisMatchValueTestButton"}
          setLoadComponent={setLoadComponent}
          instructions={matchingTestInstructions}
        />
      )}
      {loadComponent === "startMisMatchValueTestButton" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"misMatchColorValueTest"}
          startWhat="matching color test."
          setHasStarted={setHasStarted}
        />
      )}
      {loadComponent === "misMatchColorValueTest" && (
        <MisMatchingColors
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
          load={"end"}
        />
      )}
      {loadComponent === "end" && (
        <AnimatedInstructions
          load={""}
          setLoadComponent={setLoadComponent}
          instructions={endInstruction}
        />
      )}
    </div>
  );
};

export default StroopTest;
