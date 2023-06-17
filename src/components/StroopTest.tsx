import { useState, useEffect, useRef } from "react"

const StroopTest = () => {
    // Map containing colors and corresponding RGB values 
    const colors = [
        ["red", "#FF0000"],
        ["yellow", "#FFFF00"],
        ["green", "#008000"],
        ["blue", "#0000FF"]
    ]

    const [hasStarted, setHasStarted] = useState(false);

    // Keep track of response times
    const responseTimesRef = useRef(new Map());

    const startTimeRef = useRef(0);

    const responseTimeRef = useRef(0);

    // Contols how quickly the colors switch. Measured in ms. 
    const intervalLength = 1000;

    const matchingColorsTestDuration = 10000;
    
    const defaultColor= "";

    const [ currentColorName, setCurrentColorName ] = useState(defaultColor);

    const [ currentColorValue, setCurrentColorValue ] = useState(defaultColor);

    const [ verbalResponse, setVerbalResponse ] = useState("");

    const handleStartButtonClick = () => {
        setHasStarted((state) => {
            return !state
        })
    }

    const getRandomInt = (max: number): number => {
        const rand = Math.floor(Math.random() * max)
        return rand
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

    const handleResponseTemp = () => {
        responseTimeRef.current = performance.now() - startTimeRef.current;

        responseTimesRef.current = responseTimesRef.current.set([currentColorName, currentColorValue], responseTimeRef.current)
        
        console.log("Response time: ", responseTimeRef.current);
        console.log("Map: ", responseTimesRef.current)        
    }
    
    // Main loop
    useEffect(() => {
        const runId = runMatchingCondition();
        const testRunId = setTimeout(() => stopTest(runId), matchingColorsTestDuration);

        return () => {
            clearTimeout(testRunId);
        }
    }, [hasStarted])

    // Start response timer
    useEffect(() => {
        startTimeRef.current = performance.now();

      }, [currentColorName]);


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center border-solid border-black border-2 w-24 h-12 my-60">
                <p style={{color: currentColorValue}} className={`p-4 py-2`}>
                {currentColorName}
                </p>
            </div>
            <div>
                <button onClick={handleStartButtonClick} className="border-solid border-2 border-slate-500 rounded-lg p-2">
                    {hasStarted ? "Stop game!" : "Start game!"}
                </button>
                <button onClick={handleResponseTemp} className="border-solid border-2 border-slate-500 rounded-lg p-2">
                    Respond!
                </button>
                <div>Response: {`${verbalResponse}`}</div>
            </div>
            
        </div>
    );
}
 
export default StroopTest;