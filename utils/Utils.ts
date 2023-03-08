export const utils = {
  withGrid(n: number) {
    return n * 16;
  },
  asGridCoord(x: number, y: number) {
    return `${x * 16},${y * 16}`;
  },
  nextPosition(initialX: any, initialY: any, direction: string) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    return { x, y };
  },
  oppositeDirection(direction: string) {
    if (direction === "left") {
      return "right";
    }
    if (direction === "right") {
      return "left";
    }
    if (direction === "up") {
      return "down";
    }
    return "up";
  },

  emitEvent(name: string, detail: any) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
};
