import { Graphics } from "pixi.js";
import { ShapeFactoryOptions } from "./types";
import { STAR_POINTS } from "./helpers";

export class ShapeFactory {
  private size: number;
  private fill: string;

  constructor({ size = 100, referenceWidth }: ShapeFactoryOptions = {}) {
    this.size = referenceWidth ? this.getRandomSize(referenceWidth) : size;
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

  private getRandomSize(referenceWidth: number): number {
    const minPercent = 0.03;
    const maxPercent = 0.1;
    const randomPercent =
      minPercent + Math.random() * (maxPercent - minPercent);
    return referenceWidth * randomPercent;
  }

  private calculatePolygonArea(sides: number): number {
    return (
      (sides * this.size * this.size * Math.sin((2 * Math.PI) / sides)) / 2
    );
  }

  private calculateCircleArea(): number {
    return Math.PI * this.size * this.size;
  }

  private calculateEllipseArea(): number {
    const rx = this.size;
    const ry = this.size * 0.6;
    return Math.PI * rx * ry;
  }

  private calculateStarArea(): number {
    const outerRadius = this.size;
    const innerRadius = this.size / 2;
    return (
      (STAR_POINTS / 2) *
      outerRadius *
      innerRadius *
      Math.sin((2 * Math.PI) / STAR_POINTS)
    );
  }

  polygon(sides: number): Graphics {
    const g = this.createGraphics();

    const points: number[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      points.push(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
    }

    g.poly(points).fill(this.fill);
    g.area = this.calculatePolygonArea(sides);
    return g;
  }

  circle(): Graphics {
    const g = this.createGraphics();
    g.circle(0, 0, this.size).fill(this.fill);
    g.area = this.calculateCircleArea();
    return g;
  }

  ellipse(): Graphics {
    const g = this.createGraphics();
    const rx = this.size;
    const ry = this.size * 0.6;
    g.ellipse(0, 0, rx, ry).fill(this.fill);
    g.area = this.calculateEllipseArea();
    return g;
  }

  star(): Graphics {
    const g = this.createGraphics();
    const outerRadius = this.size;
    const innerRadius = this.size / 2;
    g.star(0, 0, STAR_POINTS, outerRadius, innerRadius).fill(this.fill);
    g.area = this.calculateStarArea();
    return g;
  }
}
