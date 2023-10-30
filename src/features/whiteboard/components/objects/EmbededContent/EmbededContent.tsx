import { IconButton } from "@/components";
import { useIframelyAPI } from "@/features/whiteboard/hooks";
import { Dimensions, Point } from "@/features/whiteboard/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import classNames from "classnames";

type EmbededContentProps = {
  id: string;
  selectionColor?: string;
  position: Point;
  dimensions: Dimensions;
  url: string;
  disableInteraction?: boolean;
  onPointerDown: (event: React.PointerEvent, layerId: string) => void;
  onChangeHeight: (height: number) => void;
};

export const EmbededContent = (props: EmbededContentProps) => {
  const {
    id,
    position,
    dimensions,
    url,
    selectionColor,
    disableInteraction = false,
    onPointerDown,
    onChangeHeight,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const { getUrlMetadata } = useIframelyAPI();
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  // Call iframely API to get the data we need (html) to render the embed UI
  useEffect(() => {
    if (url) {
      getUrlMetadata(url).then(
        (res) => {
          if (res.error) {
            setError({ code: res.error, message: res.message || "" });
          }

          if (res.html) {
            setHtml(res.html);
          } else {
            setIsLoading(false);
          }
        },
        (error) => {
          setError(error);
        }
      );
    } else {
      setError({ code: 400, message: "Provide url attribute for the element" });
    }
  }, []); // eslint-disable-line -- run on mount

  useEffect(() => {
    // For dynamic & testing purpose, ignore the type
    if ((window as any).iframely) {
      (window as any).iframely.load();
    }

    // Listen to message sent by iframely self-hosted iframe
    // It contains the real height of the asynchronously loaded social media embed
    const onMessage = (event: MessageEvent) => {
      if (event.origin.includes("iframe.ly")) {
        const data = JSON.parse(event.data);

        // Do nothing if the message doesn't match current url
        if (!data.url.includes(url)) {
          return;
        }

        // If method is setIframelyEmbedData or resize, handle set iframe's sizes
        if (
          data.method === "setIframelyEmbedData" ||
          data.method === "resize"
        ) {
          let iframeHeight: number | undefined;
          let aspectRatio: number | undefined;

          // Right now we'll only get height from setIframelyEmbedData & resize method
          if (data.method === "setIframelyEmbedData") {
            // Lift loading blocker when we receive this particular message from iframely's iframe
            setIsLoading(false);

            iframeHeight = data.data?.media?.height;
            aspectRatio = data.data?.media?.["aspect-ratio"] as number;

            // Sometimes height is not provided, but aspectRatio instead
            // So we need to calculate the height based on current container's WIDTH & the aspect ratio
            // However, in some cases like rendering a video, we might want to also want to take container's HEIGHT
            // into account, as we don't want the video to overflow the container vertically.
            // Overflowing makes sense for 3rd party embed like Tiktok, Instagram, etc. but for video best UX
            // would be rendering it wholely inside the container
            if (aspectRatio && !iframeHeight && containerRef.current) {
              iframeHeight = containerRef.current.clientWidth / aspectRatio;
            }
          } else if (data.method === "resize") {
            iframeHeight = data.height as number;
          }

          if (iframeHeight && !Number.isNaN(iframeHeight)) {
            onChangeHeight(iframeHeight);
          }
        }

        // If method is open-href, handle open-href
        if (data.method === "open-href") {
          window.open(data.href, "_blank");
        }
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [url]); // eslint-disable-line

  const iframeRender = useMemo(() => {
    return (
      <div
        key={html}
        dangerouslySetInnerHTML={{ __html: html }}
        className="h-full"
      />
    );
  }, [html]);

  if (!position || !dimensions) {
    return null;
  }

  return (
    <div
      id={id}
      className="absolute bg-yellow-200"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        border: `1px solid ${selectionColor}`,
        ...dimensions,
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <div
        className={classNames("h-full", {
          "pointer-events-none": disableInteraction,
        })}
      >
        {iframeRender}
      </div>
      <IconButton
        icon={<Icon icon="ri:drag-move-2-fill" width={24} />}
        className="absolute top-0 right-0 -mr-12 bg-white shadow"
      />
    </div>
  );
};
