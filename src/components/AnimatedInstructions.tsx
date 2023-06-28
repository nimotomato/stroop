import { useEffect, useState, useRef } from "react";

interface Props {
  instructions: string[];
}

const AnimatedInstructions = (props: Props) => {
  if (!props.instructions || props.instructions.length === 0) return;

  const instructionLength = 1000 * 5;

  const animationDuration = 300;

  const tickLength = 25;

  const [displayInstruction, setDisplayInstruction] = useState("");

  const [currentInstruction, setCurrentInstruction] = useState("");

  const [instructionStarted, setInstructionStarted] = useState(true);

  const [animation, setAnimation] = useState("opacity-0");

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

  return <div className={`${animation} h-20`}>{displayInstruction}</div>;
};

export default AnimatedInstructions;
