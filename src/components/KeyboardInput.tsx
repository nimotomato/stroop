import { useEffect } from "react"

const KeyboardInput = () => {
    const handleKeyDown = (event: KeyboardEvent) => {
        switch(event.key){
            case "r": console.log("red");
            break;
            case "g": console.log("red");
            break;
            case "b": console.log("red");
            break;
            case "y": console.log("red");
            break;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', (event) => handleKeyDown(event))

        return () => window.removeEventListener('keydown', (event) => handleKeyDown(event))
    }, [])

  return (
    <div>
      
    </div>
  )
}

export default KeyboardInput
