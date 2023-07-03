import { useEffect, useContext } from "react";

import RenderTrial from "./RenderTrial";
import { StroopContext } from "./StroopContext";

interface Props {
  load: string;
  activeTestDuration: number;
}

const MisMatchingColors = (props: Props) => {
  const ctx = useContext(StroopContext)!;

  // Sets the colorname and colorvalue to match
  const setMisMatchingColors = (colors: string[]) => {
    const randomValueIndex = ctx.getRandomInt(colors.length);
    let randomNameIndex = ctx.getRandomInt(colors.length);

    while (randomNameIndex === randomValueIndex) {
      randomNameIndex = ctx.getRandomInt(colors.length);
    }

    ctx.colorNameRef.current = colors[randomValueIndex]!;
    ctx.colorValueRef.current = colors[randomNameIndex]!;

    ctx.setCurrentColorName((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomValueIndex]!;
      }
    });

    ctx.setCurrentColorValue((currentColor) => {
      if (currentColor !== "") {
        return "";
      } else {
        return colors[randomNameIndex]!;
      }
    });
  };

  const runMisMatchCondition = (): NodeJS.Timer | undefined => {
    if (ctx.hasStarted) {
      return setInterval(
        () => setMisMatchingColors(ctx.colors),
        ctx.intervalLength
      );
    } else {
      ctx.clearColors();
    }
    return undefined;
  };

  useEffect(() => {
    const runId = runMisMatchCondition();

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

export default MisMatchingColors;
