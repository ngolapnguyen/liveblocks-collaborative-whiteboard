import { useOther } from "@/liveblocks.config";
import { connectionIdToColor } from "../../utils";
import { Icon } from "@iconify/react/dist/iconify.js";

type CursorProps = {
  connectionId: number;
};

export const Cursor = (props: CursorProps) => {
  const { connectionId } = props;

  //
  // RATIONALE:
  // Each cursor itself subscribes to _just_ the change for the user. This
  // means that if only one user's cursor is moving, only one <Cursor />
  // component has to re-render. All the others can remain idle.
  //
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;
  return (
    <Icon
      icon="fluent:cursor-24-filled"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
        color: connectionIdToColor(connectionId),
      }}
    />
  );
};
