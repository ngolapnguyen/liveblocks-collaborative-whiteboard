"use client";

import { Layer, WhiteboardCanvasView } from "@/features/whiteboard";
import { RoomProvider } from "@/liveblocks.config";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";

export default function Home() {
  return (
    <RoomProvider
      id="collaborative-whiteboard"
      initialPresence={{
        selection: [],
        cursor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList<string>(),
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => <WhiteboardCanvasView />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
