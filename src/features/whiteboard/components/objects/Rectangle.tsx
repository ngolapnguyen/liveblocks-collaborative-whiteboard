import { Dimensions, Point } from "../..";

type RectangleProps = {
  id: string;
  position: Point;
  dimensions: Dimensions;
  selectionColor?: string;
  onPointerDown: (event: React.PointerEvent, layerId: string) => void;
};

export const Rectangle = (props: RectangleProps) => {
  const { id, position, dimensions, selectionColor, onPointerDown } = props;

  return (
    <div
      id={id}
      className="bg-red-500 absolute left-0 top-0"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: dimensions.width,
        height: dimensions.height,
        border: `1px solid ${selectionColor}`,
      }}
      onPointerDown={(event) => onPointerDown(event, id)}
    />
  );
};
