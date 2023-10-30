import { SelectionBoxSide } from ".";

export type Point = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Geometry = {
  position: Point;
  dimensions: Dimensions;
};

export type Layer = RectangleLayer | EmbededContentLayer;

export enum LayerType {
  Rectangle,
  EmbededContent,
}

export type RectangleLayer = Geometry & {
  type: LayerType.Rectangle;
};

export type EmbededContentLayer = Geometry & {
  type: LayerType.EmbededContent;
  url: string;
};

export type Camera = {
  position: Point;
};

export enum CanvasMode {
  /**
   * Default canvas mode. Nothing is happening.
   */
  None,
  /**
   * When the user's pointer is pressed
   */
  Pressing,
  /**
   * When the user is selecting multiple layers at once
   */
  SelectionNet,
  /**
   * When the user is moving layers
   */
  Translating,
  /**
   * When the user is going to insert a Rectangle or an Ellipse
   */
  Inserting,
  /**
   * When the user is resizing a layer
   */
  Resizing,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Rectangle | LayerType.EmbededContent;
    }
  | {
      mode: CanvasMode.Resizing;
      origin: Geometry;
      side: SelectionBoxSide;
    };
