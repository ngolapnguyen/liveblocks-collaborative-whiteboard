import { IconButton } from "@/components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMemo } from "react";
import { CanvasMode, CanvasState, Layer, LayerType } from "../..";

export type ToolbarProps = {
  canvasState: CanvasState;
  setCanvasState: (canvasState: CanvasState) => void;
  insertLayer: (layerInput: Layer) => void;
};

export const Toolbar = (props: ToolbarProps) => {
  const { canvasState, setCanvasState, insertLayer } = props;

  const buttons = useMemo(
    () => [
      {
        icon: <Icon icon="fluent:cursor-24-filled" width={24} />,
        isActive:
          canvasState.mode === CanvasMode.None ||
          canvasState.mode === CanvasMode.Translating ||
          canvasState.mode === CanvasMode.SelectionNet ||
          canvasState.mode === CanvasMode.Pressing ||
          canvasState.mode === CanvasMode.Resizing,
        onClick: () => setCanvasState({ mode: CanvasMode.None }),
      },
      {
        icon: <Icon icon="ri:square-line" width={24} />,
        isActive:
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.Rectangle,
        onClick: () =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle,
          }),
      },
      {
        icon: <Icon icon="ri:image-fill" width={24} />,
        isActive:
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.EmbededContent,
        onClick: () => {
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.EmbededContent,
          });

          setTimeout(() => {
            const url = window.prompt("Enter url") || "";

            if (url) {
              insertLayer({
                type: LayerType.EmbededContent,
                url: url,
                position: { x: 0, y: 0 },
                dimensions: { width: 400, height: 400 },
              });
            } else {
              setCanvasState({ mode: CanvasMode.None });
            }
          }, 300);
        },
      },
    ],
    [canvasState, insertLayer] // eslint-disable-line
  );

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 border-1 rounded bg-white shadow p-2 flex gap-2">
      {buttons.map((button, index) => {
        const { icon, isActive, onClick } = button;

        return (
          <IconButton
            key={index}
            icon={icon}
            className={isActive ? "bg-gray-200" : ""}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
};
