import { Dispatch, SetStateAction, useState } from "react";

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
        <button
          onClick={handleOnClick}
          className="rounded bg-neutral-900 px-4 py-2 font-bold text-slate-200 hover:bg-neutral-950"
        >
          {`${props.startWhat}`}
        </button>
      )}
    </div>
  );
};

export default StartButton;
