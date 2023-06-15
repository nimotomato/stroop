import { useState, useEffect, MouseEventHandler } from "react"

const StroopTest = () => {
    // Map containing colors and corresponding RGB values 
    const colors = [
        ["red", "#FF0000"],
        ["yellow", "#FFFF00"],
        ["green", "#008000"],
        ["blue", "#0000FF"]
    ]

    const [hasStarted, setHasStarted] = useState(false);

    // Contols how quickly the colors switch. Measured in ms. 
    const intervalLength = 1000;

    const defaultColor = "white";

    const [ currentColorName, setCurrentColorName ] = useState(defaultColor);

    const [ currentColorValue, setCurrentColorValue ] = useState(defaultColor);

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
    
    useEffect(() => {
        const id = setInterval(() => setMatchingColors(colors), intervalLength);
        
        return () => clearInterval(id);        
    }, [])

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
            </div>
            
        </div>
    );
}
 
export default StroopTest;