import { Graphics } from "pixi.js";

export class StatsDisplay {
  private shapesCountInput: HTMLInputElement;
  private shapesAreaInput: HTMLInputElement;

  constructor() {
    this.shapesCountInput =
      document.querySelector<HTMLInputElement>(".js-shapes-count")!;
    this.shapesAreaInput =
      document.querySelector<HTMLInputElement>(".js-shapes-area")!;
  }

  updateShapesCount(count: number): void {
    this.shapesCountInput.value = count.toString();
  }

  updateShapesArea(shapes: Graphics[]): void {
    const totalArea = shapes.reduce((sum, shape) => {
      return sum + (shape.area || 0);
    }, 0);

    this.shapesAreaInput.value = totalArea.toFixed(2);
  }
}
