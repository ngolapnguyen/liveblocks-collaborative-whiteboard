import {
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@/liveblocks.config";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CanvasMode,
  CanvasState,
  Geometry,
  Layer,
  LayerType,
  Point,
  Toolbar,
} from "../..";
import {
  LayerComponent,
  MultiplayerGuides,
  SelectionBox,
  SelectionBoxSide,
  SelectionNet,
  resizeBounds,
  useSelectionNet,
} from "../../components";
import { useDeleteLayers } from "../../hooks";
import { useCamera } from "../../hooks/useCamera";
import { connectionIdToColor, pointerEventToCanvasPoint } from "../../utils";

export const WhiteboardCanvasView = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const { camera, cameraRef, cameraHandlers } = useCamera();

  const layerIds = useStorage((root) => root.layerIds);

  const history = useHistory();

  const deleteLayers = useDeleteLayers();

  /**
   * Hook used to listen to Undo / Redo and delete selected layers
   */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Backspace": {
          deleteLayers();
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  /**
   * Select the layer if not already selected and start translating the selection
   */
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, cameraRef.current);
      setCanvasState({ mode: CanvasMode.Translating, current: point });

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
    },
    [history, canvasState.mode]
  );

  /**
   * ====================
   * Handlers for canvas
   */

  const { startMultiSelection, updateSelectionNet } = useSelectionNet(
    layerIds,
    setCanvasState
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  /**
   * Insert an ellipse or a rectangle at the given position and select it
   */
  const insertLayer = useMutation(
    ({ storage, setMyPresence }, layerInput: Layer) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject(layerInput);
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    []
  );

  /**
   * Move selected layers on the canvas
   */
  const translateSelectedLayers = useMutation(
    ({ storage, self }, currentPosition: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: currentPosition.x - canvasState.current.x,
        y: currentPosition.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            position: {
              x: layer.get("position").x + offset.x,
              y: layer.get("position").y + offset.y,
            },
          });
        }
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: currentPosition,
      });
    },
    [canvasState]
  );

  /**
   * Resize selected layer. Only resizing a single layer is allowed.
   */
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, cursorPosition: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds({
        origin: canvasState.origin,
        side: canvasState.side,
        cursorPosition,
      });

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  /**
   * Pointer down handler for the canvas
   */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, cameraRef.current);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [canvasState.mode] // eslint-disable-line
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => setMyPresence({ cursor: null }),
    []
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, cameraRef.current);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        if (canvasState.layerType === LayerType.Rectangle) {
          insertLayer({
            type: LayerType.Rectangle,
            position: point,
            dimensions: { width: 100, height: 100 },
          });
        }
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [canvasState, history, insertLayer, unselectLayers]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, cameraRef.current);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      resizeSelectedLayer,
      startMultiSelection,
      translateSelectedLayers,
      updateSelectionNet,
    ]
  );

  /**
   * Create a map layerId to color based on the selection of all the users in the room
   */
  const otherUsers = useOthersMapped((other) => other.presence.selection);
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const otherUser of otherUsers) {
      const [connectionId, selection] = otherUser;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [otherUsers]);

  /**
   * ====================
   * Handlers for selection box & resizing stuff
   */

  /**
   * Start resizing the layer
   */
  const onResizeHandlePointerDown = useCallback(
    (side: SelectionBoxSide, origin: Geometry) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        origin,
        side,
      });
    },
    [history]
  );

  const layersRender = useMemo(() => {
    return layerIds.map((layerId) => (
      <LayerComponent
        key={layerId}
        id={layerId}
        onPointerDown={onLayerPointerDown}
        selectionColor={layerIdsToColorSelection[layerId]}
        canvasMode={canvasState.mode}
      />
    ));
  }, [
    canvasState.mode,
    layerIds,
    layerIdsToColorSelection,
    onLayerPointerDown,
  ]);

  return (
    <div className="w-screen h-screen bg-green-50">
      <div
        className="w-full h-full overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        {...cameraHandlers}
      >
        <div
          style={{
            transform: `translate(${camera.position.x}px, ${camera.position.y}px)`,
          }}
        >
          {layersRender}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <SelectionNet canvasState={canvasState} />
          <MultiplayerGuides />
        </div>
      </div>
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        insertLayer={insertLayer}
      />
    </div>
  );
};
