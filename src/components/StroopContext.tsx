import { createContext } from "react";
import type { Dispatch, SetStateAction, MutableRefObject } from "react";

type getRandomInt = (max: number) => number;
type clearColors = () => void;
type stopTest = (testId: NodeJS.Timer | undefined) => void;
type handleResponseFunction = (response: string) => void;

interface StroopContextProps {
  loadComponent: string;
  setLoadComponent: React.Dispatch<React.SetStateAction<string>>;
  stopTest: stopTest;
  getRandomInt: getRandomInt;
  colorNameRef: MutableRefObject<string>;
  colorValueRef: MutableRefObject<string>;
  resultsRef: MutableRefObject<Map<any, any>>;
  setCurrentColorName: Dispatch<SetStateAction<string>>;
  setCurrentColorValue: Dispatch<SetStateAction<string>>;
  hasStarted: boolean;
  setHasStarted: Dispatch<SetStateAction<boolean>>;
  colors: string[];
  intervalLength: number;
  clearColors: clearColors;
  setHasResponded: Dispatch<SetStateAction<boolean>>;
  hasResponded: boolean;
  handleResponse: handleResponseFunction;
  currentColorValue: string;
  currentColorName: string;
  response: string;
  setResponse: Dispatch<SetStateAction<string>>;
  startTimeRef: MutableRefObject<number>;
  responseTimeRef: MutableRefObject<number>;
}

export const StroopContext = createContext<StroopContextProps | null>(null);
