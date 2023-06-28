import { useEffect, Dispatch, SetStateAction, MutableRefObject } from "react";

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

const MatchingColors = (props: Props) => {
  // Sets the colorname and colorvalue to match
  const setMatchingColors = (colors: string[]) => {
    const randomIndex = props.getRandomInt(colors.length);

    props.colorNameRef.current = colors[randomIndex]!;
    props.colorValueRef.current = colors[randomIndex]!;

    props.setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]!;
      }
    });

    props.setCurrentColorValue((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]!;
      }
    });
  };

  const runMatchingCondition = (): NodeJS.Timer | undefined => {
    if (props.hasStarted) {
      return setInterval(
        () => setMatchingColors(props.colors),
        props.intervalLength
      );
    } else {
      props.clearColors();
    }
    return undefined;
  };

  useEffect(() => {
    const runId = runMatchingCondition();

    const testRunId = setTimeout(() => {
      props.setLoadComponent(props.load);

      props.stopTest(runId);
    }, props.activeTestDuration);

    return () => {
      // Log results
      if (props.hasStarted) {
        console.log("Results: ", props.resultsRef.current);
        props.resultsRef.current = []; // Reset data
      }

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

export default MatchingColors;
