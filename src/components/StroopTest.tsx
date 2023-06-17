import { useState, useEffect, useRef, Dispatch, SetStateAction, MouseEventHandler  } from "react"

import SpeechInput from "./SpeechInput";
import KeyboardInput from "./KeyboardInput";

const StroopTest = () => {
    // Map containing colors and corresponding RGB values 
    const colors = [
        ["red", "#FF0000"],
        ["yellow", "#FFFF00"],
        ["green", "#008000"],
        ["blue", "#0000FF"]
    ]

    const [hasStarted, setHasStarted] = useState(false);

    const resultsRef = useRef(new Array);

    const startTimeRef = useRef(0);

    const responseTimeRef = useRef(0);

    const [ hasResponded, setHasResponded ] = useState(false); // This is used to restrict test taker to only respond once. 

    // Contols how quickly the colors switch. Measured in ms. 
    const intervalLength = 1000;

    const matchingColorsTestDuration = 20 * 1000; 
    
    const defaultColor= "";

    const [ currentColorName, setCurrentColorName ] = useState(defaultColor);

    const [ currentColorValue, setCurrentColorValue ] = useState(defaultColor);


    const handleStartButtonClick = () => {
        setHasStarted((state) => {
            return !state
        })
    }

    const getRandomInt = (max: number): number => {
        return Math.floor(Math.random() * max)
     }
    
    const clearColors = () => {
        setCurrentColorName(() => {
            return ""
        })

        setCurrentColorValue(() => {
            return ""
        })
    }

    // Sets the colorname and colorvalue to match
    const setMatchingColors = (colors: string[][]) => {
        let randomIndex = getRandomInt(colors.length);

        const nameIndex = 0;
        const valueIndex = 1;

        setCurrentColorName((currentColor) => {
            if (currentColor !== ""){
                return ""
            } else {
                return colors[randomIndex]![nameIndex]!
            }
        })

        setCurrentColorValue(() => {
            return colors[randomIndex]![valueIndex]!
        })


    }

    const runMatchingCondition = (): NodeJS.Timer | undefined => {
        if (hasStarted){
            return setInterval(() => setMatchingColors(colors), intervalLength);            
        } else {
            clearColors();
        }
        return undefined;
    }

    const stopTest = (testId: NodeJS.Timer | undefined) => {
        clearColors();

        clearInterval(testId);
        
        setHasStarted(false);
    }

    const handleResponse = (response: string) => {
        responseTimeRef.current = performance.now() - startTimeRef.current;

        resultsRef.current.push({"currentColorName": currentColorName, "currentColorValue": currentColorValue, "response": response, "responseTime": responseTimeRef.current})
    }

    // Main loop
    useEffect(() => {
        const runId = runMatchingCondition();
        const testRunId = setTimeout(() => stopTest(runId), matchingColorsTestDuration);

        return () => {
            // Log results
            if (hasStarted){
                console.log("Results: ", resultsRef.current)
                resultsRef.current = new Array();
            }
    
            clearInterval(runId)
            clearTimeout(testRunId);
        }
    }, [hasStarted])

    // Start response timer
    useEffect(() => {
        if (currentColorName !== ""){
            setHasResponded(() => false) // Reset response gate
            startTimeRef.current = performance.now();
        }
        
      }, [currentColorName]);


    return (
        <div className="flex flex-col justify-center items-center">
            <KeyboardInput setHasResponded={setHasResponded} hasResponded={hasResponded} handleResponse={handleResponse}/>
            <div className="flex justify-center items-center border-solid border-black border-2 w-24 h-12 mb-60 mt-32 ">
                <p style={{color: currentColorValue}} className={`p-4 py-2`}>
                {currentColorName}
                </p>
            </div>
            <div>
                <button onClick={handleStartButtonClick} className="border-solid border-2 border-slate-500 rounded-lg p-2">
                    {hasStarted ? "Stop game!" : "Start game!"}
                </button>
            </div>
            
        </div>
    );
}
 
export default StroopTest;