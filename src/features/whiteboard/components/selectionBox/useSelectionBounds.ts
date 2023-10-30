import { shallow } from "@liveblocks/react";
import { Geometry, Layer } from "../..";
import { useSelf, useStorage } from "@/liveblocks.config";

function boundingBox(layers: Layer[]): Geometry | null {
  const first = layers[0];

  if (!first) {
    return null;
  }

  let left = first.position.x;
  let right = first.position.x + first.dimensions.width;
  let top = first.position.y;
  let bottom = first.position.y + first.dimensions.height;

  for (let i = 1; i < layers.length; i++) {
    const {
      position: { x, y },
      dimensions: { width, height },
    } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    position: {
      x: left,
      y: top,
    },
    dimensions: {
      width: right - left,
      height: bottom - top,
    },
  };
}

export default function useSelectionBounds() {
  const selection = useSelf((me) => me.presence.selection);
  return useStorage((root) => {
    const selectedLayers = selection
      .map((layerId) => root.layers.get(layerId)!)
      .filter(Boolean);

    return boundingBox(selectedLayers);
  }, shallow);
}
