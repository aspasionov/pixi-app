export class ControlsManager {
  private gravity: number;
  private shapesPerSecond: number;
  private onGravityChange: (value: number) => void;
  private onShapesPerSecondChange: (value: number) => void;

  private gravityDisplay: Element;
  private shapesDisplay: Element;

  constructor(
    initialGravity: number,
    initialShapesPerSecond: number,
    onGravityChange: (value: number) => void,
    onShapesPerSecondChange: (value: number) => void,
  ) {
    this.gravity = initialGravity;
    this.shapesPerSecond = initialShapesPerSecond;
    this.onGravityChange = onGravityChange;
    this.onShapesPerSecondChange = onShapesPerSecondChange;

    this.gravityDisplay = document.querySelector(".js-gravity-value")!;
    this.shapesDisplay = document.querySelector(".js-shapes-value")!;

    this.updateGravityDisplay();
    this.updateShapesDisplay();
    this.initializeControls();
  }

  private initializeControls(): void {
    this.setupGravityControls();
    this.setupShapesControls();
  }

  private setupGravityControls(): void {
    const gravityButtons = document.querySelectorAll(".js-gravity-btn");

    gravityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.getAttribute("data-value");
        if (value === "increase") {
          this.gravity += 0.5;
        } else if (value === "decrease") {
          this.gravity = Math.max(0, this.gravity - 0.5);
        }
        this.updateGravityDisplay();
        this.onGravityChange(this.gravity);
      });
    });
  }

  private setupShapesControls(): void {
    const shapesButtons = document.querySelectorAll(".js-shapes-btn");

    shapesButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.getAttribute("data-value");
        if (value === "increase") {
          this.shapesPerSecond = Math.min(10, this.shapesPerSecond + 1);
        } else if (value === "decrease") {
          this.shapesPerSecond = Math.max(0, this.shapesPerSecond - 1);
        }
        this.updateShapesDisplay();
        this.onShapesPerSecondChange(this.shapesPerSecond);
      });
    });
  }

  private updateGravityDisplay(): void {
    this.gravityDisplay.textContent = `Gravity: ${this.gravity.toFixed(1)}`;
  }

  private updateShapesDisplay(): void {
    this.shapesDisplay.textContent = `Shapes per second: ${this.shapesPerSecond}`;
  }

  public getGravity(): number {
    return this.gravity;
  }

  public getShapesPerSecond(): number {
    return this.shapesPerSecond;
  }
}
