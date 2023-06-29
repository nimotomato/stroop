import { Dispatch, SetStateAction } from "react";

import KeyboardInput from "./KeyboardInput";

type handleResponseFunction = (arg1: string) => void;

interface Props {
  setHasResponded: Dispatch<SetStateAction<boolean>>;
  hasResponded: boolean;
  handleResponse: handleResponseFunction;
  currentColorValue: string;
  currentColorName: string;
}

const RenderTrial = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="stroop keyboard-input">
        <KeyboardInput
          setHasResponded={props.setHasResponded}
          hasResponded={props.hasResponded}
          handleResponse={props.handleResponse}
        />
        <div className="flex h-12 w-24 items-center justify-center border-2 border-solid border-black ">
          <p style={{ color: props.currentColorValue }} className={`p-4 py-2`}>
            {props.currentColorName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RenderTrial;
