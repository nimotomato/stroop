import { useEffect, useState, Dispatch, SetStateAction } from "react";

interface Props {
  instructions: string[];
  setLoadComponent: Dispatch<SetStateAction<string>>;
  load: string;
}

const AnimatedInstructions = (props: Props) => {
  if (!props.instructions || props.instructions.length === 0) {
    return null;
  }

  const instructionLength = 1000 * 5;

  const animationDuration = 300;

  const tickLength = 25;

  const [displayInstruction, setDisplayInstruction] = useState("");

  const [currentInstruction, setCurrentInstruction] = useState("");

  const [instructionStarted, setInstructionStarted] = useState(true);

  const [animation, setAnimation] = useState(
    `transition-opacity opacity-0 duration-${animationDuration}`
  );

  const timers: NodeJS.Timeout[] = [];

  const animateInstructions = (instructions: string[]) => {
    for (let i = 0; i < instructions.length; i++) {
      timers.push(
        setTimeout(
          () => setCurrentInstruction(instructions[i]!),
          instructionLength * i
        )
      );
    }
  };

  const clearTimers = () => {
    if (timers.length === 0) return;

    timers.map((timer) => {
      clearTimeout(timer);
    });
  };

  // Fades in and out the text
  useEffect(() => {
    setAnimation(
      `transition-opacity opacity-100 duration-${animationDuration}`
    );

    const timeOutId = setTimeout(
      () =>
        setAnimation(
          `transition-opacity opacity-0 duration-${animationDuration}`
        ),
      instructionLength - animationDuration * 2
    );

    return () => clearTimeout(timeOutId);
  }, [currentInstruction]);

  // Clears all timers when instructions are false
  useEffect(() => {
    if (!instructionStarted) {
      clearTimers();
      return;
    }

    animateInstructions(props.instructions);

    return () => {
      setInstructionStarted(false);
    };
  }, [instructionStarted]);

  // Typewriter effect
  useEffect(() => {
    let currentCharIndex = 0;
    let currentWord = currentInstruction;
    let typedWord = "";

    if (currentCharIndex === currentInstruction.length) return;

    let tickId = setInterval(() => {
      typedWord = currentWord.slice(0, currentCharIndex);
      setDisplayInstruction(typedWord);

      currentCharIndex += 1;
    }, tickLength);

    return () => {
      clearInterval(tickId);
    };
  }, [currentInstruction]);

  // Watch for EOF
  useEffect(() => {
    if (currentInstruction === "EOI") {
      props.setLoadComponent(props.load);
    }
  }, [currentInstruction]);

  if (currentInstruction === "EOI") {
    clearTimers();
    return null;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className={`${animation} h-2 w-48 text-left`}>
        {displayInstruction}
      </div>
    </div>
  );
};

export default AnimatedInstructions;
