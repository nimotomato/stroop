import { Result } from "postcss";
import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";

type ResultSumItem = {
  trial: string;
  results: [
    {
      colorName: string;
      colorValue: string;
      response: string;
      responseTime: number;
    }
  ];
};

interface Props {
  resultsRef: MutableRefObject<
    Map<
      string,
      [
        {
          colorName: string;
          colorValue: string;
          response: string;
          responseTime: number;
        }
      ]
    >
  >;
  errorsRef: MutableRefObject<number>;
}

const ShowResults = ({ resultsRef, errorsRef }: Props) => {
  const [meanResponseTime, setMeanResponseTime] = useState(0);

  // Calculate mean response time
  useEffect(() => {
    let totalResponses = 0;
    let responseTimes = 0;

    resultsRef.current.forEach((value, _key) => {
      value.forEach((trialResults) => {
        responseTimes += trialResults.responseTime;
        totalResponses += 1;
      });
    });

    setMeanResponseTime(responseTimes / totalResponses);
  }, [resultsRef]);

  return (
    <div className="w-54 m-14 bg-slate-900 p-4 text-sm">
      <div className="pb-2">Mean response time: {meanResponseTime}</div>
      <div>Errors: {errorsRef.current}</div>
    </div>
  );
};

export default ShowResults;
