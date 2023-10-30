import {
  LiveList,
  LiveMap,
  LiveObject,
  createClient,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Layer, Point } from "./features/whiteboard";

const client = createClient({
  publicApiKey:
    "pk_dev_HbLXta2eldy-nCouIfdkvOKZH3PBkIdjFGVCgSQyXA1hvnS_quzPVrMmEtrf_uzP",
});

type Presence = {
  selection: string[];
  cursor: Point | null;
};

type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

export const {
  suspense: {
    RoomProvider,
    useStorage,
    useMutation,
    useSelf,
    useHistory,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
  },
} = createRoomContext<Presence, Storage>(client);
