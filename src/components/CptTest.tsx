import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

import Hexagon from "../data/Hexagon";
import Octagon from "../data/Octagon";
import StartButton from "./StartButton";

import { i } from "../data/cptInstructions";

type ResultSumItem = {
  trial: string;
  results: [
    {
      responseTime: number;
      symbol: string;
    }
  ];
};

interface Props {
  defaultBgColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  setTestHasFinished: Dispatch<SetStateAction<boolean>>;
  userEmail: string;
}

const CptTest = (props: Props) => {
  const resultsRef = useRef();
  const shapeRef = useRef();
  const [currentShape, setCurrentShape] = useState<JSX.Element | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalDurationRef = useRef(1000 * 0.3);
  const testDurationRef = useRef(1000 * 10);
  const [loadComponent, setLoadComponent] = useState("warmUpButton-1");

  useEffect(() => {
    const handleShape = () => {
      const shape = Math.floor(Math.random() * 2);

      setCurrentShape(() => {
        if (!shape) return null;

        if (shape === 0) {
          return <Hexagon />;
        } else {
          return <Octagon />;
        }
      });
    };

    const stimulusInterval = setInterval(
      handleShape,
      intervalDurationRef.current
    );

    return () => {
      clearInterval(stimulusInterval);
    };
  }, [hasStarted]);

  return <div></div>;
};

export default CptTest;
