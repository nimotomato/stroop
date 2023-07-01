import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  instructions: string[];
  setLoadComponent: Dispatch<SetStateAction<string>>;
  load: string;
}

const AnimatedInstructions = ({
  instructions,
  setLoadComponent,
  load,
}: Props) => {
  const tickLength = 25;

  const [displayInstruction, setDisplayInstruction] = useState("");

  const [currentInstruction, setCurrentInstruction] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [nextIndex, setNextIndex] = useState(1);

  const [instructionStarted, setInstructionStarted] = useState(true);

  const [stopInstructions, setStopInstructions] = useState(false);

  const handleOnClick = () => {
    if (instructions[nextIndex] === "EOI") {
      setLoadComponent(load);
      setStopInstructions(true);
    }

    setCurrentIndex((index) => {
      const updatedIndex = index + 1;

      if (typeof instructions[updatedIndex] !== "string") {
        return index;
      }

      setCurrentInstruction(instructions[updatedIndex] as string);

      return updatedIndex;
    });
  };

  useEffect(() => {
    if (stopInstructions) return;
  }, [stopInstructions]);

  useEffect(() => {
    let index = currentIndex;
    setNextIndex((index += 1));
  }, [currentIndex]);

  // Set first instruction
  useEffect(() => {
    if (!instructionStarted) {
      return;
    }

    if (instructions[0]) setCurrentInstruction(instructions[0]);

    return () => {
      setInstructionStarted(false);
    };
  }, [instructionStarted]);

  // Typewriter effect
  useEffect(() => {
    if (currentInstruction === "") return;

    let currentCharIndex = 0;
    const currentWord = currentInstruction;
    let typedWord = "";

    const tickId = setInterval(() => {
      typedWord = currentWord.slice(0, currentCharIndex);
      setDisplayInstruction(typedWord);

      currentCharIndex += 1;
    }, tickLength);

    return () => {
      clearInterval(tickId);
    };
  }, [currentInstruction]);

  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <div
      style={{ height: "96vh" }}
      className="flex flex-col items-center justify-center text-center"
    >
      <div
        className={`flex h-full w-48 flex-col items-center justify-center text-left`}
      >
        <div className="h-1/6">{displayInstruction}</div>
        <div className="flex w-full justify-end">
          <button
            className="btn mt-8 w-fit p-1 text-sm "
            onClick={handleOnClick}
          >
            next<span className="text-green-600">.</span>
            <span className="text-yellow-300">.</span>
            <span className="text-red-600">.</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedInstructions;
