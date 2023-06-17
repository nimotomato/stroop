import { Dispatch, SetStateAction, useEffect } from "react";

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
    
interface Props {
    hasStarted: boolean,
    handleSetTranscript: Function,
    handleResponse: Function
}

const SpeechInput = ( props: Props ) => {
    // Object to keep track of the transcript
    const { transcript, resetTranscript, interimTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition()

    // Return if browser does not support speech recognition
    if (!browserSupportsSpeechRecognition) {
       return(
        <div className="speech-support-error-wrapper">
            Speech is not supported by this browser. The best user experience is with Google Chrome. 
        </div>
       )
      }
    

    // Toggle listening
    useEffect(() => {
        if (props.hasStarted){
            SpeechRecognition.startListening({ language: 'en-US', continuous: true })
        } else {
            SpeechRecognition.stopListening();
            resetTranscript;
        }
    }, [props.hasStarted])

    useEffect(() => {
        if (props.hasStarted){
            props.handleSetTranscript(transcript); // Update transcript in StroopTest component
        }
        
    }, [transcript])

    useEffect(() => {
        if (props.hasStarted){
            props.handleResponse();
        }
    }, [interimTranscript])


    return ( 
    <div className="microphone-wrapper">
        <div className="listening-indicator">
            {listening ? "The mic is on!" : "Not listening."}
        </div>
      <div className="microphone-result-container">
        <div className="microphone-result-text">Result: { transcript }</div>
        <button className="microphone-reset btn" >
          Reset
        </button>
      </div>

  </div>  );
}
 
export default SpeechInput;