import { useEffect, useState, useRef } from "react";
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

  const nextIndexRef = useRef(1);

  const [instructionStarted, setInstructionStarted] = useState(true);

  const [stopInstructions, setStopInstructions] = useState(false);

  const handleOnClick = () => {
    if (instructions[nextIndexRef.current] === "EOI") {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.code === "Space" || e.code === "Enter")) return;

      if (instructions[nextIndexRef.current] === "EOI") {
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

    document.addEventListener("keypress", handleKeyDown);

    return () => {
      document.removeEventListener("keypress", handleKeyDown);
    };
  }, [currentInstruction]);

  useEffect(() => {
    if (stopInstructions) return;
  }, [stopInstructions]);

  useEffect(() => {
    const index = currentIndex;
    nextIndexRef.current = index + 1;
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
    <div className="disable-select flex flex-col items-center justify-center text-center ">
      <div
        className={`flex h-56 w-52 flex-col items-center justify-center text-left`}
      >
        <div className="h-3/4">{displayInstruction}</div>
        <div className="flex h-fit w-full justify-end">
          <button
            className="btn mt-8 pl-2 pr-2 text-sm"
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
