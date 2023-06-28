import { useState, useEffect, useRef } from "react";

import KeyboardInput from "./KeyboardInput";
import Countdown from "./Countdown";

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

  const [instructions, setInstructions] = useState(
    <div className="instructions">
      Control your response with the keyboard. Only the first keypress each
      stimulus counts towards your score. <br />
      Please, keep your fingers on the keys at all times to be more efficient.
      <br />
      R = Red <br />
      Y = Yellow <br />
      G = Green <br />B = Blue
    </div>
  );

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
  const setMatchingColors = (colors: string[]) => {
    const randomIndex = getRandomInt(colors.length);

    colorNameRef.current = colors[randomIndex]!;
    colorValueRef.current = colors[randomIndex]!;

    setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]!;
      }
    });

    setCurrentColorValue((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]!;
      }
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

  useEffect(() => {
    const runId = runMatchingCondition();

    const testRunId = setTimeout(() => stopTest(runId), activeTestDuration);

    return () => {
      // Log results
      if (hasStarted) {
        console.log("Results: ", resultsRef.current);
        resultsRef.current = []; // Reset data
      }

      clearInterval(runId);
      clearTimeout(testRunId);
    };
  }, [hasStarted]);

  useEffect(() => {
    const runId = runHeteroCondition();

    const testRunId = setTimeout(() => stopTest(runId), activeTestDuration);

    return () => {
      // Log results
      if (hasStarted) {
        console.log("Results: ", resultsRef.current);
        resultsRef.current = []; // Reset data
      }

      clearInterval(runId);

      clearTimeout(testRunId);
    };
  }, [hasStarted]);

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
      <div className="mt-24">{instructions}</div>
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
