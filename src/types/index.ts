export interface ShapeFactoryOptions {
  size?: number;
  referenceWidth?: number;
}

declare module "pixi.js" {
  interface Graphics {
    area?: number;
    isFullyVisible?: boolean;
  }
}
