import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

import MatchingColors from "./MatchingColors";
import MisMatchingColors from "./MisMatchingColors";
import AnimatedInstructions from "src/components/AnimatedInstructions";

import { i } from "src/data/instructions";
import StartButton from "./StartButton";

type ResultsItem = {
  colorName: string;
  colorValue: string;
  response: string;
  responseTime: number;
};

interface Props {
  setBackgroundColor: Dispatch<SetStateAction<string>>;
}

const StroopTest = (props: Props) => {
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

  const [currentColorName, setCurrentColorName] = useState("");

  const [currentColorValue, setCurrentColorValue] = useState("");

  const colorNameRef = useRef("");

  const colorValueRef = useRef("");

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

  const resetResults = () => {
    resultsRef.current = []; // Reset data

    return true;
  };

  const sendResultsToDb = () => {
    console.log("Results: ", resultsRef.current);

    return true;
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

  const [loadComponent, setLoadComponent] = useState("testButton-3");

  if (loadComponent === "") return null;

  return (
    <div className="flex h-screen flex-col items-center justify-center text-slate-200">
      {/* On load, display initial instructions in the center of the screen. */}
      {loadComponent === "initialInstructions" && (
        <AnimatedInstructions
          load={"keyboardInstructions"}
          setLoadComponent={setLoadComponent}
          instructions={i.initialInstructions}
        />
      )}
      {loadComponent === "initialInstructions" && resetResults()}
      {/* Show instructions on how to use keyboard */}
      {loadComponent === "keyboardInstructions" && (
        <AnimatedInstructions
          load={"warmUpButton-1"}
          setLoadComponent={setLoadComponent}
          instructions={i.keyboardInstructions}
        />
      )}
      {/* Allow user to start the warm up */}
      {loadComponent === "warmUpButton-1" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"warmUp-1"}
          startWhat="matching color warm up."
          setHasStarted={setHasStarted}
        />
      )}
      {/* Start warm up */}
      {loadComponent === "warmUp-1" && (
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
          load={"testInstructions-1"}
        />
      )}
      {/* Instructions for the first test */}
      {loadComponent === "testInstructions-1" && (
        <AnimatedInstructions
          load={"testButton-1"}
          setLoadComponent={setLoadComponent}
          instructions={i.matchingTestInstructions}
        />
      )}
      {/* Start button for first test */}
      {loadComponent === "testButton-1" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"test-1"}
          startWhat="matching color test."
          setHasStarted={setHasStarted}
        />
      )}
      {/* First test */}
      {loadComponent === "test-1" && (
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
          load={"warmUpInstruction-2"}
        />
      )}
      {/* Second test instructions */}
      {loadComponent === "warmUpInstruction-2" && (
        <AnimatedInstructions
          load={"warmUpButton-2"}
          setLoadComponent={setLoadComponent}
          instructions={i.mismatchColorTextInstruction}
        />
      )}
      {/* Start button for second warm up */}
      {loadComponent === "warmUpButton-2" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"warmUp-2"}
          startWhat="color text warm up."
          setHasStarted={setHasStarted}
        />
      )}
      {/* Second warm up */}
      {loadComponent === "warmUp-2" && (
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
          load={"testInstructions-2"}
        />
      )}
      {/* Second test instructions repeat */}
      {loadComponent === "testInstructions-2" && (
        <AnimatedInstructions
          load={"testButton-2"}
          setLoadComponent={setLoadComponent}
          instructions={i.mismatchColorTextInstructionRepeat}
        />
      )}
      {/* Second test start button */}
      {loadComponent === "testButton-2" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"test-2"}
          startWhat="color text test."
          setHasStarted={setHasStarted}
        />
      )}
      {/* Second test */}
      {loadComponent === "test-2" && (
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
          load={"warmUpInstructions-3"}
        />
      )}
      {/* Third test instructions */}
      {loadComponent === "warmUpInstructions-3" && (
        <AnimatedInstructions
          load={"warmUpButton-3"}
          setLoadComponent={setLoadComponent}
          instructions={i.mismatchColorValueInstruction}
        />
      )}
      {/* Third warm up start button*/}
      {loadComponent === "warmUpButton-3" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"warmUp-3"}
          startWhat="font color warm up."
          setHasStarted={setHasStarted}
        />
      )}
      {/* Third warm up*/}
      {loadComponent === "warmUp-3" && (
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
          load={"testInstructions-3"}
        />
      )}
      {/* Third test instruction repeat*/}
      {loadComponent === "testInstructions-3" && (
        <AnimatedInstructions
          load={"testButton-3"}
          setLoadComponent={setLoadComponent}
          instructions={i.mismatchColorValueInstructionRepeat}
        />
      )}
      {/* Third test start button*/}
      {loadComponent === "testButton-3" && (
        <StartButton
          setLoadComponent={setLoadComponent}
          load={"test-3"}
          startWhat="font color test."
          setHasStarted={setHasStarted}
        />
      )}
      {/* Third test*/}
      {loadComponent === "test-3" && (
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
      {/* End text */}
      {loadComponent === "end" && sendResultsToDb() && (
        <AnimatedInstructions
          load={""}
          setLoadComponent={setLoadComponent}
          instructions={i.endInstruction}
        />
      )}
    </div>
  );
};

export default StroopTest;
