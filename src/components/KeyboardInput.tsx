import { useEffect, Dispatch, SetStateAction } from "react"

interface Props {
  setHasResponded: Dispatch<SetStateAction<boolean>>,
  hasResponded: boolean,
  handleResponse: Function
}

const KeyboardInput = ( props: Props ) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!props.hasResponded){
        props.setHasResponded(() => true);
        switch(event.key){
          case "r": 
            props.handleResponse("red");
            break;
          case "g": 
            props.handleResponse("green");
            break;
          case "b": 
            props.handleResponse("blue");
            break;
          case "y": 
            props.handleResponse("yellow");
            break;
          default:
            props.handleResponse(event.key);
         }
      }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [props.hasResponded])

  return (
    <div className="mt-24">
      Control your response with the keyboard. Only the first keypress each stimulus counts towards your score. <br />
      Please, keep your fingers on the keys at all times to be more effecient. <br />
      R = Red <br />
      Y = Yellow <br />
      G = Green <br />
      B = Blue
    </div>
  )
}

export default KeyboardInput
