import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!countDownTimer) {
      document.addEventListener("keydown", handleOnClick);
    } else {
      document.removeEventListener("keydown", handleOnClick);
    }

    return () => {
      document.removeEventListener("keydown", handleOnClick);
    };
  }, [countDownTimer]);

  return (
    <div>
      {countDownTimer ? (
        <Countdown
          setCountDownTimer={setCountDownTimer}
          timerHasStarted={countDownTimer}
          countDownLength={countDownLength}
        />
      ) : (
        <span>
          <button onClick={handleOnClick} className="btn">
            {`${props.startWhat}`}
          </button>
          <p className="text-center text-sm text-slate-400">
            press any key to continue
          </p>
        </span>
      )}
    </div>
  );
};

export default StartButton;
