import { Application, Graphics, FederatedPointerEvent } from "pixi.js";
import { ShapeFactory } from "./ShapeFactory";
import {
  getRundomItemFromArray,
  throttle,
  FOOTER_AND_HEADER_HEIGHT,
  MILLISECONDS_PER_SECOND,
  SHAPE_SPAWN_Y_OFFSET,
  TRIANGLE_SIDES,
  SQUARE_SIDES,
  PENTAGON_SIDES,
  HEXAGON_SIDES,
  DEFAULT_GRAVITY,
  DEFAULT_SHAPES_PER_SECOND,
  BACKGROUND_COLOR,
} from "./helpers";
import { ControlsManager } from "./ControlsManager";
import { StatsDisplay } from "./StatsDisplay";

(async () => {
  const app = new Application();
  await app.init({
    background: BACKGROUND_COLOR,
    width: window.innerWidth,
    height: window.innerHeight - FOOTER_AND_HEADER_HEIGHT,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const fallingShapes: Graphics[] = [];
  let gravity = DEFAULT_GRAVITY;
  let shapesPerSecond = DEFAULT_SHAPES_PER_SECOND;
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

  const statsDisplay = new StatsDisplay();

  const shapeListener = (event: FederatedPointerEvent, shape: Graphics) => {
    event.stopPropagation();
    shape.removeAllListeners();
    app.stage.removeChild(shape);
    const index = fallingShapes.indexOf(shape);
    if (index > -1) {
      fallingShapes.splice(index, 1);
    }
    const visibleShapes = fallingShapes.filter((s) => s.isFullyVisible);
    statsDisplay.updateShapesCount(visibleShapes.length);
    statsDisplay.updateShapesArea(visibleShapes);
  };

  const handleResize = throttle(() => {
    app.renderer.resize(
      window.innerWidth,
      window.innerHeight - FOOTER_AND_HEADER_HEIGHT,
    );

    mask.clear();
    mask.rect(0, 0, app.screen.width, app.screen.height).fill(0xffffff);

    app.stage.hitArea = app.screen;
  }, 250);

  const handleAddShape = (
    x = Math.random() * app.screen.width,
    y = SHAPE_SPAWN_Y_OFFSET,
  ) => {
    const shapeType = getRundomItemFromArray(shapeTypes);
    const newFactory = new ShapeFactory({ referenceWidth: app.screen.width });
    let shape: Graphics;

    switch (shapeType) {
      case "triangle":
        shape = newFactory.polygon(TRIANGLE_SIDES);
        break;
      case "square":
        shape = newFactory.polygon(SQUARE_SIDES);
        break;
      case "pentagon":
        shape = newFactory.polygon(PENTAGON_SIDES);
        break;
      case "hexagon":
        shape = newFactory.polygon(HEXAGON_SIDES);
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
        shape = newFactory.polygon(TRIANGLE_SIDES);
    }

    shape.position.set(x, y);
    shape.eventMode = "static";
    shape.cursor = "pointer";

    shape.on("pointerdown", (e) => shapeListener(e, shape));

    fallingShapes.push(shape);
    app.stage.addChild(shape);
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
    const interval =
      shapesPerSecond > 0 ? MILLISECONDS_PER_SECOND / shapesPerSecond : 0;
    if (interval > 0) {
      shapeIntervalId = setInterval(() => {
        handleAddShape();
      }, interval);
    }
  };

  startShapeInterval();

  app.ticker.add((time) => {
    let visibilityChanged = false;

    for (let i = fallingShapes.length - 1; i >= 0; i--) {
      const shape = fallingShapes[i];
      shape.y += gravity * time.deltaTime;

      const bounds = shape.getBounds();

      if (!shape.isFullyVisible && bounds.y + bounds.height >= 0) {
        shape.isFullyVisible = true;
        visibilityChanged = true;
      }

      if (bounds.y > app.screen.height) {
        shape.removeAllListeners();
        app.stage.removeChild(shape);
        fallingShapes.splice(i, 1);
        visibilityChanged = true;
      }
    }

    if (visibilityChanged) {
      const visibleShapes = fallingShapes.filter((s) => s.isFullyVisible);
      statsDisplay.updateShapesCount(visibleShapes.length);
      statsDisplay.updateShapesArea(visibleShapes);
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

  window.addEventListener("resize", handleResize);
})();
