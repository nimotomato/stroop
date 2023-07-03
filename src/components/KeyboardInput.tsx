import { useEffect, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

import { StroopContext } from "./StroopContext";

type handleResponseFunction = (response: string) => void;

interface Props {
  setHasResponded: Dispatch<SetStateAction<boolean>>;
  hasResponded: boolean;
  handleResponse: handleResponseFunction;
}

const KeyboardInput = (props: Props) => {
  const ctx = useContext(StroopContext)!;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!props.hasResponded) {
      props.setHasResponded(() => true);
      switch (event.key) {
        case "r":
          props.handleResponse("red");
          break;
        case "g":
          props.handleResponse("green");
          break;
        case "b":
          props.handleResponse("blue");
          break;
        case "y":
          props.handleResponse("yellow");
          break;
        default:
          props.handleResponse(event.key);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props.hasResponded]);

  return <></>;
};

export default KeyboardInput;
