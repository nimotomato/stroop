import { useEffect, useState, Dispatch, SetStateAction } from "react";

interface Props {
    timerHasStarted: boolean,
    countDownLength: number,
    setCountDownTimer: Dispatch<SetStateAction<boolean>>
}

const Countdown = ( props: Props ) => {
    const [ timer, setTimer ] = useState(props.countDownLength / 1000);

    const _time = 1000;

    useEffect(() => {
        if (timer < 1){
            props.setCountDownTimer((state) => !state)
        }

        const timerId = setInterval(() => {
            if (props.timerHasStarted){
                setTimer((timer) => timer - 1);
            }
    
        }, _time)
    

        return () => clearInterval(timerId);
    }, [ props.timerHasStarted, timer ])

    return (<div className="flex justify-center items-center border-solid border-black border-2 w-24 h-12 mb-60 mt-32 ">
        {timer}
    </div>  );
}
 
export default Countdown;