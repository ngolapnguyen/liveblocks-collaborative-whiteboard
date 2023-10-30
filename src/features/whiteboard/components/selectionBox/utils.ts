import { Geometry, Point } from "../..";
import { SelectionBoxSide } from "./types";

export function resizeBounds(props: {
  origin: Geometry;
  cursorPosition: Point;
  side: SelectionBoxSide;
}) {
  const { origin, side, cursorPosition } = props;

  const result: Geometry = JSON.parse(JSON.stringify(origin));

  if ((side & SelectionBoxSide.Left) === SelectionBoxSide.Left) {
    result.position.x = Math.min(
      cursorPosition.x,
      origin.position.x + origin.dimensions.width
    );
    result.dimensions.width = Math.abs(
      origin.position.x + origin.dimensions.width - cursorPosition.x
    );
  }

  if ((side & SelectionBoxSide.Right) === SelectionBoxSide.Right) {
    result.position.x = Math.min(cursorPosition.x, origin.position.x);
    result.dimensions.width = Math.abs(cursorPosition.x - origin.position.x);
  }

  if ((side & SelectionBoxSide.Top) === SelectionBoxSide.Top) {
    result.position.y = Math.min(
      cursorPosition.y,
      origin.position.y + origin.dimensions.height
    );
    result.dimensions.height = Math.abs(
      origin.position.y + origin.dimensions.height - cursorPosition.y
    );
  }

  if ((side & SelectionBoxSide.Bottom) === SelectionBoxSide.Bottom) {
    result.position.y = Math.min(cursorPosition.y, origin.position.y);
    result.dimensions.height = Math.abs(cursorPosition.y - origin.position.y);
  }

  return result;
}
