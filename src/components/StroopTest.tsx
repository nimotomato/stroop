import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
} from "react";

import SpeechInput from "./SpeechInput";
import KeyboardInput from "./KeyboardInput";
import Countdown from "./Countdown";

const StroopTest = () => {
  // Map containing colors and corresponding RGB values
  const colors = [
    ["red", "#FF0000"],
    ["yellow", "#FFFF00"],
    ["green", "#008000"],
    ["blue", "#0000FF"],
  ];

  const trials = new Map([
    ["firstTrial", "matchingColors"],
    ["secondTrial", "colorValue"],
    ["thirdTrial", "colorName"],
  ]);

  const [hasStarted, setHasStarted] = useState(false);

  const resultsRef = useRef(new Array());

  const startTimeRef = useRef(0);

  const responseTimeRef = useRef(0);

  const [hasResponded, setHasResponded] = useState(false); // This is used to restrict test taker to only respond once.

  // Contols how quickly the colors switch. Measured in ms.
  const intervalLength = 1500;

  const matchingColorsTestDuration = 10 * 1000;

  const defaultColor = "";

  const countDownLength = 5 * 1000;

  const [colorHistory, setColorHistory] = useState(new Array());

  const [currentColorName, setCurrentColorName] = useState(defaultColor);

  const [currentColorValue, setCurrentColorValue] = useState(defaultColor);

  const [countDownTimer, setCountDownTimer] = useState(false);

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
  const setMatchingColors = (colors: string[][]) => {
    let randomIndex = getRandomInt(colors.length);

    const nameIndex = 0;
    const valueIndex = 1;

    setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]![nameIndex]!;
      }
    });

    setCurrentColorValue(() => {
      return colors[randomIndex]![valueIndex]!;
    });

    colorHistory.push({
      colorName: colors[randomIndex]![nameIndex]!,
      colorValue: colors[randomIndex]![valueIndex]!,
    });
  };

  const setNonMatchingColors = (colors: string[][]) => {
    let randomNameIndex = getRandomInt(colors.length);
    let randomValueIndex = getRandomInt(colors.length);

    const nameIndex = 0;
    const valueIndex = 1;

    setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomNameIndex]![nameIndex]!;
      }
    });

    setCurrentColorValue(() => {
      return colors[randomValueIndex]![valueIndex]!;
    });

    colorHistory.push({
      colorName: colors[randomNameIndex]![nameIndex]!,
      colorValue: colors[randomValueIndex]![valueIndex]!,
    });
  };

  const runMatchingCondition = (): NodeJS.Timer | undefined => {
    if (hasStarted) {
      return setInterval(() => setMatchingColors(colors), intervalLength);
    } else {
      clearColors();
    }
    return undefined;
  };

  const stopTest = (testId: NodeJS.Timer | undefined) => {
    clearColors();

    clearInterval(testId);

    setHasStarted(false);
  };

  const handleResponse = (response: string) => {
    responseTimeRef.current = performance.now() - startTimeRef.current;

    resultsRef.current.push({
      currentColorName: colorHistory[colorHistory.length - 1].colorName,
      currentColorValue: colorHistory[colorHistory.length - 1].colorValue,
      response: response,
      responseTime: responseTimeRef.current,
    });
  };

  // Main loop
  useEffect(() => {
    const runId = runMatchingCondition();

    const testRunId = setTimeout(
      () => stopTest(runId),
      matchingColorsTestDuration
    );

    return () => {
      // Log results
      if (hasStarted) {
        console.log("Results: ", resultsRef.current);
        resultsRef.current = new Array(); // Reset data
      }

      clearInterval(runId);

      clearTimeout(testRunId);
    };
  }, [hasStarted]);

  // Start response timer
  useEffect(() => {
    if (currentColorName !== "") {
      setHasResponded(() => false); // Reset response gate
      startTimeRef.current = performance.now();
    }
  }, [currentColorName]);

  const renderTrial = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="stroop keyboard-input">
          <KeyboardInput
            setHasResponded={setHasResponded}
            hasResponded={hasResponded}
            handleResponse={handleResponse}
          />
          <div className="mb-60 mt-32 flex h-12 w-24 items-center justify-center border-2 border-solid border-black ">
            <p style={{ color: currentColorValue }} className={`p-4 py-2`}>
              {currentColorName}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-24">
        Control your response with the keyboard. Only the first keypress each
        stimulus counts towards your score. <br />
        Please, keep your fingers on the keys at all times to be more effecient.{" "}
        <br />
        R = Red <br />
        Y = Yellow <br />
        G = Green <br />B = Blue
      </div>
      {countDownTimer ? (
        <Countdown
          setCountDownTimer={setCountDownTimer}
          countDownLength={countDownLength}
          timerHasStarted={countDownTimer}
        />
      ) : (
        (hasStarted && renderTrial()) || null
      )}
      <div>
        {!countDownTimer && !hasStarted && (
          <button
            onClick={handleStartButtonClick}
            className="rounded-lg border-2 border-solid border-slate-500 p-2"
          >
            Start test!
          </button>
        )}
      </div>
    </div>
  );
};

export default StroopTest;