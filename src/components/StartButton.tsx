import { Dispatch, SetStateAction, MouseEventHandler } from "react";

interface Props {
  startWhat: string;
  load: string;
  setLoadComponent: Dispatch<SetStateAction<string>>;
  setHasStarted: Dispatch<SetStateAction<boolean>>;
}

const StartButton = (props: Props) => {
  const handleOnClick = () => {
    props.setLoadComponent(props.load);
    props.setHasStarted(true);
  };

  return (
    <button
      onClick={handleOnClick}
      className="rounded bg-neutral-900 px-4 py-2 font-bold text-slate-200 hover:bg-neutral-950"
    >
      {`${props.startWhat}`}
    </button>
  );
};

export default StartButton;
