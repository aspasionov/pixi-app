import { Application } from "pixi.js";

export class StatsDisplay {
  private shapesCountInput: HTMLInputElement;
  private shapesAreaInput: HTMLInputElement;
  private lastUpdateTime = 0;
  private readonly UPDATE_INTERVAL = 100;
  private bgColor = { r: 0x10, g: 0x99, b: 0xbb };
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.shapesCountInput = document.querySelector<HTMLInputElement>(".js-shapes-count")!;
    this.shapesAreaInput = document.querySelector<HTMLInputElement>(".js-shapes-area")!;
  }

  updateShapesCount(count: number): void {
    this.shapesCountInput.value = count.toString();
  }

  updateShapesArea(): void {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.UPDATE_INTERVAL) return;
    this.lastUpdateTime = now;

    const pixelCount = this.countNonBackgroundPixels();
    this.shapesAreaInput.value = pixelCount.toString();
  }

  private countNonBackgroundPixels(): number {
    const result = this.app.renderer.extract.pixels({ target: this.app.stage });
    const pixels = result.pixels;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a > 128 && !(r === this.bgColor.r && g === this.bgColor.g && b === this.bgColor.b)) {
        count++;
      }
    }

    return count;
  }
}
