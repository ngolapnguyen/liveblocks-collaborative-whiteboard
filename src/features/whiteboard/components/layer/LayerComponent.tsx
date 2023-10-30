import { useMutation, useStorage } from "@/liveblocks.config";
import { CanvasMode, EmbededContent, LayerType, Rectangle } from "../..";

type LayerProps = {
  id: string;
  selectionColor?: string;
  canvasMode: CanvasMode;
  onPointerDown: (event: React.PointerEvent, layerId: string) => void;
};

export const LayerComponent = (props: LayerProps) => {
  const { id, selectionColor, canvasMode, onPointerDown } = props;

  const layer = useStorage((root) => root.layers.get(id));

  const onChangeHeight = useMutation(
    ({ storage }, height: number) => {
      const liveLayer = storage.get("layers").get(id);
      if (liveLayer) {
        liveLayer.update({
          dimensions: {
            ...liveLayer.get("dimensions"),
            height,
          },
        });
      }
    },
    [id]
  );

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Rectangle: {
      return (
        <Rectangle
          id={id}
          onPointerDown={onPointerDown}
          selectionColor={selectionColor}
          {...layer}
        />
      );
    }
    case LayerType.EmbededContent: {
      return (
        <EmbededContent
          id={id}
          onPointerDown={onPointerDown}
          selectionColor={selectionColor}
          onChangeHeight={onChangeHeight}
          disableInteraction={
            canvasMode === CanvasMode.Pressing ||
            canvasMode === CanvasMode.Resizing ||
            canvasMode === CanvasMode.SelectionNet ||
            canvasMode === CanvasMode.Translating
          }
          {...layer}
        />
      );
    }
    default: {
      console.warn("Unknown layer type");

      return null;
    }
  }
};
