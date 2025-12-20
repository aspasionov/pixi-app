import { Application, Graphics, FederatedPointerEvent } from "pixi.js";
import { ShapeFactory } from "./ShapeFactory";
import { getRundomItemFromArray } from "./helpers";
import { ControlsManager } from "./ControlsManager";
import { StatsDisplay } from "./StatsDisplay";

(async () => {
  const app = new Application();
  await app.init({
    background: "#1099bb",
    width: window.innerWidth,
    height: window.innerHeight - 120,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const fallingShapes: Graphics[] = [];
  let gravity = 2;
  let shapesPerSecond = 1;
  let shapeIntervalId: number;
  const shapeTypes = [
    "triangle",
    "square",
    "pentagon",
    "hexagon",
    "circle",
    "ellipse",
    "star",
  ];

  const statsDisplay = new StatsDisplay(app);

  const shapeListener = (event: FederatedPointerEvent, shape: Graphics) => {
    event.stopPropagation();
    app.stage.removeChild(shape);
    const index = fallingShapes.indexOf(shape);
    if (index > -1) {
      fallingShapes.splice(index, 1);
    }
    statsDisplay.updateShapesCount(fallingShapes.length);
    statsDisplay.updateShapesArea();
  };

  const handleAddShape = (x = Math.random() * app.screen.width, y = -100) => {
    const shapeType = getRundomItemFromArray(shapeTypes);
    const newFactory = new ShapeFactory({ referenceWidth: app.screen.width });
    let shape: Graphics;

    switch (shapeType) {
      case "triangle":
        shape = newFactory.polygon(3);
        break;
      case "square":
        shape = newFactory.polygon(4);
        break;
      case "pentagon":
        shape = newFactory.polygon(5);
        break;
      case "hexagon":
        shape = newFactory.polygon(6);
        break;
      case "circle":
        shape = newFactory.circle();
        break;
      case "ellipse":
        shape = newFactory.ellipse();
        break;
      case "star":
        shape = newFactory.star();
        break;
      default:
        shape = newFactory.polygon(3);
    }

    shape.position.set(x, y);
    shape.eventMode = "static";
    shape.cursor = "pointer";

    shape.on("pointerdown", (e) => shapeListener(e, shape));

    fallingShapes.push(shape);
    app.stage.addChild(shape);
    statsDisplay.updateShapesCount(fallingShapes.length);
    statsDisplay.updateShapesArea();
  };

  const areaListener = (event: FederatedPointerEvent) => {
    handleAddShape(event.global.x, event.global.y);
  };

  const mask = new Graphics()
    .rect(0, 0, app.screen.width, app.screen.height)
    .fill(0xffffff);
  app.stage.addChild(mask);
  app.stage.mask = mask;

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;

  app.stage.on("pointerdown", areaListener);

  const startShapeInterval = () => {
    if (shapeIntervalId) {
      clearInterval(shapeIntervalId);
    }
    const interval = shapesPerSecond > 0 ? 1000 / shapesPerSecond : 0;
    if (interval > 0) {
      shapeIntervalId = setInterval(() => {
        handleAddShape();
      }, interval);
    }
  };

  startShapeInterval();

  app.ticker.add((time) => {
    for (let i = fallingShapes.length - 1; i >= 0; i--) {
      const shape = fallingShapes[i];
      shape.y += gravity * time.deltaTime;

      if (shape.y > app.screen.height + 100) {
        app.stage.removeChild(shape);
        fallingShapes.splice(i, 1);
        statsDisplay.updateShapesCount(fallingShapes.length);
        statsDisplay.updateShapesArea();
      }
    }
  });

  new ControlsManager(
    gravity,
    shapesPerSecond,
    (newGravity) => {
      gravity = newGravity;
    },
    (newShapesPerSecond) => {
      shapesPerSecond = newShapesPerSecond;
      startShapeInterval();
    },
  );
})();
