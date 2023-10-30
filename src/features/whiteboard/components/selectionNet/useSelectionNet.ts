import { useMutation } from "@/liveblocks.config";
import { CanvasMode, CanvasState, Point } from "../..";
import { findIntersectingLayersWithRectangle } from "../../utils";
import { useCallback } from "react";

export const useSelectionNet = (
  layerIds: readonly string[],
  setCanvasState: (canvasState: CanvasState) => void
) => {
  /**
   * Start multiselection with the selection net if the pointer move enough since pressed
   */
  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    // If the distance between the pointer position and the pointer position when it was pressed
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []); // eslint-disable-line

  /**
   * Update the position of the selection net and select the layers accordingly
   */
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();

      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  return { startMultiSelection, updateSelectionNet };
};
