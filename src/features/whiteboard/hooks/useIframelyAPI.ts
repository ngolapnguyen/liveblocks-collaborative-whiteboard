const IFRAMELY_KEY = "e1f7fecd01482d7a718e67acf5e61af3";

export type IframelyMedia = {
  href: string;
  type: string;
  media: {
    width: number;
    height: number;
  };
  rel: string[];
};

export type IframelyMetadata = {
  site?: string;
  author?: string;
  title?: string;
  description?: string;
  medium?: string;
};

export type IFramelyResponse = {
  url: string;
  meta: IframelyMetadata;
  links?: {
    thumbnail?: IframelyMedia[];
    image?: IframelyMedia[];
    file?: IframelyMedia[];
    reader?: IframelyMedia[];
  };
  html?: string;
  error?: number;
  message?: string;
};

export const useIframelyAPI = () => {
  const getUrlMetadata = async (url: string): Promise<IFramelyResponse> => {
    return fetch(
      `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(
        url
      )}&key=${IFRAMELY_KEY}&iframe=1&omit_script=1&omit_css=1`
    ).then((res) => res.json());
  };

  return {
    getUrlMetadata,
  };
};
