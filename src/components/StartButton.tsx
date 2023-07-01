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

  const handleOnButtonPress = (e: KeyboardEvent) => {
    if (!(e.code === "Space" || e.code === "Enter")) return;

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
      document.addEventListener("keydown", handleOnButtonPress);
    } else {
      document.removeEventListener("keydown", handleOnButtonPress);
    }

    return () => {
      document.removeEventListener("keydown", handleOnButtonPress);
    };
  }, [countDownTimer]);

  return (
    <div className="disable-select">
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
          <p className="text-center text-sm text-slate-400">continue...</p>
        </span>
      )}
    </div>
  );
};

export default StartButton;
