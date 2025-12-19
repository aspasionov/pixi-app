import { Graphics } from "pixi.js";
import { ShapeFactoryOptions } from './types';

export class ShapeFactory {
  private size: number;
  private fill: string;

  constructor({
    size = 100,
    referenceWidth
  }: ShapeFactoryOptions = {}) {
    this.size = referenceWidth ? (referenceWidth * 0.1) : size;
    this.fill = this.getRandomColor();
  }

  private createGraphics(): Graphics {
    const g = new Graphics();
    return g;
  }

  private getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  polygon(sides: number): Graphics {
    const g = this.createGraphics();

    const points: number[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      points.push(
        Math.cos(angle) * this.size,
        Math.sin(angle) * this.size
      );
    }

    g.poly(points).fill(this.fill);
    return g;
  }

  // ⚪ Circle
  circle(): Graphics {
    const g = this.createGraphics();
    g.circle(0, 0, this.size).fill(this.fill);
    return g;
  }

  ellipse(): Graphics {
    const g = this.createGraphics();
    const rx = this.size
    const ry = this.size * 0.6
    g.ellipse(0, 0, rx, ry).fill(this.fill);
    return g;
  }

  star(): Graphics {
    const g = this.createGraphics();
    const outerRadius = this.size;
    const innerRadius = this.size / 2
    g.star(0, 0, 5, outerRadius, innerRadius).fill(this.fill);
    return g;
  }
}
