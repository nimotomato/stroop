import { useEffect, useState, Dispatch, SetStateAction } from "react";

interface Props {
  timerHasStarted: boolean;
  countDownLength: number;
  setCountDownTimer: Dispatch<SetStateAction<boolean>>;
}

const Countdown = (props: Props) => {
  const [timer, setTimer] = useState(props.countDownLength / 1000);

  const _time = 1000;

  useEffect(() => {
    if (timer < 1) {
      props.setCountDownTimer((state) => !state);
    }

    const timerId = setInterval(() => {
      if (props.timerHasStarted) {
        setTimer((timer) => timer - 1);
      }
    }, _time);

    return () => clearInterval(timerId);
  }, [props.timerHasStarted, timer]);

  return (
    <div className="flex h-12 w-24 items-center justify-center border-2 border-solid border-black ">
      {timer}
    </div>
  );
};

export default Countdown;
