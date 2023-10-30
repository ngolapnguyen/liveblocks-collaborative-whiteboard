import { CanvasMode, CanvasState } from "../..";

type SelectionNetProps = {
  canvasState: CanvasState;
};

export const SelectionNet = (props: SelectionNetProps) => {
  const { canvasState } = props;

  if (canvasState.mode !== CanvasMode.SelectionNet) {
    return null;
  }

  if (!canvasState.current) {
    return null;
  }

  return (
    <div
      className="border border-solid border-blue-500 bg-blue-200 bg-opacity-10 absolute"
      style={{
        transform: `translate(${Math.min(
          canvasState.origin.x,
          canvasState.current.x
        )}px, ${Math.min(canvasState.origin.y, canvasState.current.y)}px)`,
        width: Math.abs(canvasState.origin.x - canvasState.current.x),
        height: Math.abs(canvasState.origin.y - canvasState.current.y),
      }}
    />
  );
};
