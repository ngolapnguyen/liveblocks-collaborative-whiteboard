import { CSSProperties } from "react";
import { Geometry, Layer, LayerType } from "../..";
import { SelectionBoxSide } from "./types";
import { useSelf, useStorage } from "@/liveblocks.config";
import useSelectionBounds from "./useSelectionBounds";

const HANDLE_SIZE = 8;

type HandleRectProps = {
  style: CSSProperties;
  onPointerDown: (e: React.PointerEvent) => void;
};

const HandleRect = (props: HandleRectProps) => {
  const { style, onPointerDown } = props;

  return (
    <div
      className="bg-white border border-solid border-blue-500 absolute top-0 left-0"
      style={{ width: HANDLE_SIZE, height: HANDLE_SIZE, ...style }}
      onPointerDown={onPointerDown}
    />
  );
};

type SelectionBoxProps = {
  onResizeHandlePointerDown: (side: SelectionBoxSide, origin: Geometry) => void;
};

export const SelectionBox = (props: SelectionBoxProps) => {
  const { onResizeHandlePointerDown } = props;

  // We should show resize handles if exactly one shape is selected and it's
  // not a path layer
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );

  const isShowingHandles = useStorage((root) => soleLayerId);

  const bounds = useSelectionBounds();
  if (!bounds) {
    return null;
  }

  return (
    <>
      <div
        className="border border-solid border-blue-500 absolute top-0 left-0 pointer-events-none"
        style={{
          transform: `translate(${bounds.position.x}px, ${bounds.position.y}px)`,
          width: bounds.dimensions.width,
          height: bounds.dimensions.height,
        }}
      />
      {isShowingHandles && (
        <>
          <HandleRect
            style={{
              cursor: "nwse-resize",
              transform: `translate(${bounds.position.x - HANDLE_SIZE / 2}px, ${
                bounds.position.y - HANDLE_SIZE / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(
                SelectionBoxSide.Top + SelectionBoxSide.Left,
                bounds
              );
            }}
          />
          <HandleRect
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${
                bounds.position.x +
                bounds.dimensions.width / 2 -
                HANDLE_SIZE / 2
              }px, ${bounds.position.y - HANDLE_SIZE / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(SelectionBoxSide.Top, bounds);
            }}
          />
          <HandleRect
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${
                bounds.position.x - HANDLE_SIZE / 2 + bounds.dimensions.width
              }px, ${bounds.position.y - HANDLE_SIZE / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(
                SelectionBoxSide.Top + SelectionBoxSide.Right,
                bounds
              );
            }}
          />
          <HandleRect
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${
                bounds.position.x - HANDLE_SIZE / 2 + bounds.dimensions.width
              }px, ${
                bounds.position.y +
                bounds.dimensions.height / 2 -
                HANDLE_SIZE / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(SelectionBoxSide.Right, bounds);
            }}
          />
          <HandleRect
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${
                bounds.position.x - HANDLE_SIZE / 2 + bounds.dimensions.width
              }px, ${
                bounds.position.y - HANDLE_SIZE / 2 + bounds.dimensions.height
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(
                SelectionBoxSide.Bottom + SelectionBoxSide.Right,
                bounds
              );
            }}
          />
          <HandleRect
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${
                bounds.position.x +
                bounds.dimensions.width / 2 -
                HANDLE_SIZE / 2
              }px, ${
                bounds.position.y - HANDLE_SIZE / 2 + bounds.dimensions.height
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(SelectionBoxSide.Bottom, bounds);
            }}
          />
          <HandleRect
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${bounds.position.x - HANDLE_SIZE / 2}px, ${
                bounds.position.y - HANDLE_SIZE / 2 + bounds.dimensions.height
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(
                SelectionBoxSide.Bottom + SelectionBoxSide.Left,
                bounds
              );
            }}
          />
          <HandleRect
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              transform: `translate(${bounds.position.x - HANDLE_SIZE / 2}px, ${
                bounds.position.y -
                HANDLE_SIZE / 2 +
                bounds.dimensions.height / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(SelectionBoxSide.Left, bounds);
            }}
          />
        </>
      )}
    </>
  );
};
