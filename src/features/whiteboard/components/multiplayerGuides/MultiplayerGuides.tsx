import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { Cursor } from "./Cursor";

function Cursors() {
  //
  // RATIONALE:
  // We're using useConnectionIds() here instead of useOthers(), because this
  // will only re-render this component if users enter or leave.
  //
  // Each <Cursor /> component we loop over here will subscribe to necessary
  // changes happening for _that_ user alone, which is most rendering
  // efficient.
  //
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
}

export const MultiplayerGuides = () => {
  return (
    <>
      <Cursors />
    </>
  );
};
