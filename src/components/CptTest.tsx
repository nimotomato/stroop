import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

import Hexagon from "../data/Hexagon";
import Square from "../data/Square";
import StartButton from "./StartButton";
import AnimatedInstructions from "./AnimatedInstructions";

import { api } from "~/utils/api";
import { i } from "../data/cptInstructions";

type ResultItem = {
  responseTime: number;
  shape: string;
};

interface Props {
  defaultBgColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  setTestHasFinished: Dispatch<SetStateAction<boolean>>;
  userEmail: string;
}

const CptTest = (props: Props) => {
  // Results and response time trackings
  const resultsRef = useRef(new Map<string, ResultItem[]>());
  const respondedRef = useRef(true); // This is initially true to prevent weird interactions with response before stimulus
  const startTimeRef = useRef(0);
  const [clickCounter, setClickCounter] = useState(0);
  const spamCeiling = useRef(4);
  const [spamBlock, setSpamBlock] = useState(false);
  const [errors, setErrors] = useState(0);
  const [meanResponseTime, setMeanResponseTime] = useState(0);

  // Keep track of shapes
  const shapeRef = useRef<string>("");
  const [currentShape, setCurrentShape] = useState<JSX.Element | null>(null);

  // Control most timings
  const stimulusDurationRef = useRef(500);
  const intervalDurationRef = useRef(stimulusDurationRef.current * 4);
  const paddingDurationRef = useRef(intervalDurationRef.current - 25);
  const warmUpDurationRef = useRef(
    paddingDurationRef.current + intervalDurationRef.current * 20
  );
  const testDurationRef = useRef(
    paddingDurationRef.current + intervalDurationRef.current * 100
  );
  const [hasStarted, setHasStarted] = useState(false);

  // Like an event bus
  const [loadComponent, setLoadComponent] = useState("start");

  // For warm up error handling
  const flashTime = 50;
  const errorFlashColor = "bg-red-500";

  // TO DO:
  // Send data to db
  // Show results
  // adjust test length

  // Prevents user from just spamming
  useEffect(() => {
    if (!hasStarted) return;

    const spamSheild = () => {
      setClickCounter((clickCounter) => (clickCounter += 1));
    };

    document.addEventListener("mousedown", spamSheild);

    if (clickCounter > spamCeiling.current) {
      setLoadComponent("error");
      setSpamBlock(true);
      setTimeout(() => {
        props.setTestHasFinished(true);
      }, 3000);
    }

    console.log(clickCounter);

    return () => {
      document.removeEventListener("mousedown", spamSheild);
    };
  }, [hasStarted, clickCounter]);

  // Clear resultsRef before each test
  useEffect(() => {
    if (loadComponent === "start") {
      resultsRef.current.clear();
    }
  }, [loadComponent]);

  useEffect(() => {
    if (!hasStarted) return;

    const errorFlash = () => {
      props.setBackgroundColor(errorFlashColor);
      setTimeout(
        () => props.setBackgroundColor(props.defaultBgColor),
        flashTime
      );
    };

    const handleResponse = () => {
      if (respondedRef.current) return;

      // Keep response from happening several times
      respondedRef.current = true;

      const responseTime: number = performance.now() - startTimeRef.current;

      const currentResponses = resultsRef.current.get(loadComponent);

      if (currentResponses) {
        console.log("RESPONSE PUSH");
        currentResponses.push({
          responseTime: responseTime,
          shape: shapeRef.current,
        });
      } else {
        console.log("RESPONSE SET");

        resultsRef.current.set(loadComponent, [
          {
            responseTime: responseTime,
            shape: shapeRef.current,
          },
        ]);
      }

      if (shapeRef.current === "hexagon") {
        if (loadComponent === "warmUp") {
          errorFlash();
        }
        // Local error tally
        setErrors((error) => (error += 1));
      }
    };

    const handleOmission = () => {
      const currentResponses = resultsRef.current.get(loadComponent);

      if (currentResponses) {
        console.log("OMISSION PUSH");
        currentResponses.push({
          responseTime: 0,
          shape: shapeRef.current,
        });
      } else {
        console.log("OMISSION SET");

        resultsRef.current.set(loadComponent, [
          {
            responseTime: 0,
            shape: shapeRef.current,
          },
        ]);
      }

      if (shapeRef.current === "square") {
        if (loadComponent === "warmUp") {
          errorFlash();
        }
        // Local error tally
        setErrors((error) => (error += 1));
      }
    };

    // Add eventlistener
    document.addEventListener("click", handleResponse);

    //Shows shape and starts response timer
    const showShape = () => {
      if (!respondedRef.current) {
        handleOmission();
      }
      // Reset spam defense
      setClickCounter(0);

      const shapeNumber = Math.floor(Math.random() * 2);
      let shape: JSX.Element;
      let shapeString: string;

      if (shapeNumber === 0) {
        shape = <Hexagon />;
        shapeString = "hexagon";
      } else {
        shape = <Square />;
        shapeString = "square";
      }

      shapeRef.current = shapeString;

      setCurrentShape(() => {
        respondedRef.current = false;

        startTimeRef.current = performance.now();
        return shape;
      });
    };

    const hideShape = () => {
      setCurrentShape(null);
    };

    let showId: NodeJS.Timeout;
    let hideId: NodeJS.Timeout;

    // This interval controls what happens during the interval duration.
    // This should be showing and hiding a randomly selected stimulus at a random time.
    const stimulusInterval = setInterval(() => {
      // Set a randomly timed delay before showing stimulus to add difficulty.
      // The delay should be between 0 and interval duration minus stimulus duration * 2, so as not to exceed the alotted interval duration.
      const showDelay = Math.floor(
        Math.random() *
          (intervalDurationRef.current - stimulusDurationRef.current * 3)
      );

      // Hides the stimulus after stimulusDuration has passed.
      const hideDelay = showDelay + stimulusDurationRef.current;

      showId = setTimeout(showShape, showDelay);
      hideId = setTimeout(hideShape, hideDelay);
    }, intervalDurationRef.current);

    // Start timer depending on what's running
    let duration;
    if (loadComponent === "warmUp") {
      duration = warmUpDurationRef.current;
    } else {
      duration = testDurationRef.current;
    }

    // Shuts down the test
    const testDurationTimeout = setTimeout(
      () => setHasStarted(false),
      duration
    );

    return () => {
      // Record last stimulus if omission:
      if (!respondedRef.current) {
        handleOmission();
      }

      // Reset stimulus
      shapeRef.current = "";
      setCurrentShape(null);

      // Clear timings
      clearInterval(stimulusInterval);
      clearTimeout(testDurationTimeout);
      clearTimeout(showId);
      clearTimeout(hideId);

      // Clear event listener
      document.removeEventListener("click", handleResponse);

      // Set next load
      if (loadComponent === "warmUp") {
        setLoadComponent("preTestInstructions");
      } else if (loadComponent === "test") {
        setLoadComponent("end");
      }
    };
  }, [hasStarted]);

  // API wizardry
  const sendData = api.CPTTest.sendData.useMutation();

  // Handle end state
  useEffect(() => {
    // Send results to database
    if (loadComponent === "end") {
      const results = Array.from(resultsRef.current).map((x) => {
        return { trial: x[0], results: x[1] };
      });
      sendData.mutate({ testTaker: props.userEmail, testScore: results });

      // Calculate mean response time
      let totalResponses = 0;
      let responseTime = 0;

      results.forEach((value) => {
        value.results.forEach((trialResults) => {
          if (
            trialResults.shape === "hexagon" ||
            trialResults.responseTime === 0
          )
            return;
          responseTime += trialResults.responseTime;
          totalResponses += 1;
        });
      });

      setMeanResponseTime(responseTime / totalResponses);
    }

    // Return to main screen
    if (loadComponent === "") {
      props.setTestHasFinished(true);
    }
  }, [loadComponent]);

  // DEBUG
  useEffect(() => {
    console.log(resultsRef.current);
  }, [hasStarted]);

  return (
    <div>
      {spamBlock && <div> No spamming allowed. Please start over. </div>}

      {loadComponent === "start" && (
        <AnimatedInstructions
          instructions={i.initialInstructions}
          load="warmUp-start-button"
          setLoadComponent={setLoadComponent}
        />
      )}
      {loadComponent === "warmUp-start-button" && (
        <StartButton
          startWhat="start warm up"
          setHasStarted={setHasStarted}
          load="warmUp"
          setLoadComponent={setLoadComponent}
        />
      )}
      {loadComponent === "warmUp" && currentShape}
      {loadComponent === "preTestInstructions" && (
        <AnimatedInstructions
          instructions={i.preTestInstructions}
          load="test-start-button"
          setLoadComponent={setLoadComponent}
        />
      )}
      {loadComponent === "test-start-button" && (
        <StartButton
          startWhat="start test"
          setHasStarted={setHasStarted}
          load="test"
          setLoadComponent={setLoadComponent}
        />
      )}
      {loadComponent === "test" && currentShape}
      {loadComponent === "end" && (
        <div>
          <div className="w-54 m-14 bg-slate-900 p-4 text-sm">
            <div className="pb-2">Mean response time: {meanResponseTime}</div>
            <div>Errors: {errors}</div>
          </div>
          <AnimatedInstructions
            setLoadComponent={setLoadComponent}
            load=""
            instructions={i.endInstruction}
          />
        </div>
      )}
    </div>
  );
};

export default CptTest;
