import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import Countdown from "./Countdown";

interface Props {
  startWhat: string;
  load: string;
  setLoadComponent: Dispatch<SetStateAction<string>>;
  setHasStarted: Dispatch<SetStateAction<boolean>>;
}

const StartButton = (props: Props) => {
  const countDownLength = 1000 * 5;

  const [countDownTimer, setCountDownTimer] = useState(false);

  const handleOnClick = () => {
    setCountDownTimer((state) => {
      return !state;
    });

    setTimeout(() => {
      props.setLoadComponent(props.load);
      props.setHasStarted(true);
    }, countDownLength);
  };

  return (
    <div>
      {countDownTimer ? (
        <Countdown
          setCountDownTimer={setCountDownTimer}
          timerHasStarted={countDownTimer}
          countDownLength={countDownLength}
        />
      ) : (
        <button onClick={handleOnClick} className="btn">
          {`${props.startWhat}`}
        </button>
      )}
    </div>
  );
};

export default StartButton;
