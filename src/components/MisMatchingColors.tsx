import { useEffect } from "react";

import type { Dispatch, SetStateAction, MutableRefObject } from "react";

import RenderTrial from "./RenderTrial";

type getRandomInt = (max: number) => number;
type clearColors = () => void;
type stopTest = (testId: NodeJS.Timer | undefined) => void;
type handleResponseFunction = (arg1: string) => void;

type ResultsItem = {
  colorName: string;
  colorValue: string;
  response: string;
  responseTime: number;
};

interface Props {
  stopTest: stopTest;
  getRandomInt: getRandomInt;
  colorNameRef: MutableRefObject<string>;
  colorValueRef: MutableRefObject<string>;
  resultsRef: MutableRefObject<ResultsItem[]>;
  setCurrentColorName: Dispatch<SetStateAction<string>>;
  setCurrentColorValue: Dispatch<SetStateAction<string>>;
  hasStarted: boolean;
  colors: string[];
  intervalLength: number;
  activeTestDuration: number;
  clearColors: clearColors;
  setHasResponded: Dispatch<SetStateAction<boolean>>;
  hasResponded: boolean;
  handleResponse: handleResponseFunction;
  currentColorValue: string;
  currentColorName: string;
  load: string;
  setLoadComponent: Dispatch<SetStateAction<string>>;
}

const MisMatchingColors = (props: Props) => {
  // Sets the colorname and colorvalue to match
  const setMisMatchingColors = (colors: string[]) => {
    const randomValueIndex = props.getRandomInt(colors.length);
    let randomNameIndex = props.getRandomInt(colors.length);

    while (randomNameIndex === randomValueIndex) {
      randomNameIndex = props.getRandomInt(colors.length);
    }

    props.colorNameRef.current = colors[randomValueIndex]!;
    props.colorValueRef.current = colors[randomNameIndex]!;

    props.setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomValueIndex]!;
      }
    });

    props.setCurrentColorValue((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomNameIndex]!;
      }
    });
  };

  const runMisMatchCondition = (): NodeJS.Timer | undefined => {
    if (props.hasStarted) {
      return setInterval(
        () => setMisMatchingColors(props.colors),
        props.intervalLength
      );
    } else {
      props.clearColors();
    }
    return undefined;
  };

  useEffect(() => {
    const runId = runMisMatchCondition();

    const testRunId = setTimeout(() => {
      props.setLoadComponent(props.load);

      props.stopTest(runId);
    }, props.activeTestDuration);

    return () => {
      clearInterval(runId);
      clearTimeout(testRunId);
    };
  }, [props.hasStarted]);

  return (
    <RenderTrial
      hasResponded={props.hasResponded}
      handleResponse={props.handleResponse}
      currentColorName={props.currentColorName}
      currentColorValue={props.currentColorValue}
      setHasResponded={props.setHasResponded}
    />
  );
};

export default MisMatchingColors;
