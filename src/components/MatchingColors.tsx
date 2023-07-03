import { useEffect, useContext } from "react";

import RenderTrial from "./RenderTrial";
import { StroopContext } from "./StroopContext";

interface Props {
  load: string;
  activeTestDuration: number;
}

const MatchingColors = (props: Props) => {
  const ctx = useContext(StroopContext)!;

  // Sets the colorname and colorvalue to match
  const setMatchingColors = (colors: string[]) => {
    const randomIndex = ctx.getRandomInt(colors.length);

    ctx.colorNameRef.current = colors[randomIndex]!;
    ctx.colorValueRef.current = colors[randomIndex]!;

    ctx.setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]!;
      }
    });

    ctx.setCurrentColorValue((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomIndex]!;
      }
    });
  };

  const runMatchingCondition = (): NodeJS.Timer | undefined => {
    if (ctx.hasStarted) {
      return setInterval(
        () => setMatchingColors(ctx.colors),
        ctx.intervalLength
      );
    } else {
      ctx.clearColors();
    }
    return undefined;
  };

  useEffect(() => {
    const runId = runMatchingCondition();

    const testRunId = setTimeout(() => {
      ctx.setLoadComponent(props.load);

      ctx.stopTest(runId);
    }, props.activeTestDuration);

    return () => {
      clearInterval(runId);
      clearTimeout(testRunId);
    };
  }, [ctx.hasStarted]);

  return (
    <RenderTrial
      hasResponded={ctx.hasResponded}
      handleResponse={ctx.handleResponse}
      currentColorName={ctx.currentColorName}
      currentColorValue={ctx.currentColorValue}
      setHasResponded={ctx.setHasResponded}
    />
  );
};

export default MatchingColors;
