"use client";
import { useEffect, useRef } from "react";
import "styles/editor.scss";
import { defaultState } from "utils/editor/DefaultState";

export default function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tilesetContainer = useRef<HTMLDivElement>(null);
  const tilesetSelection = useRef<HTMLDivElement>(null);
  const tilesetImage = useRef<HTMLImageElement>(null);
  // const tilesetImage: any = document.querySelector("#tileset-source");
  let selection = [0, 0]; //Which tile we will paint from the menu
  let isMouseDown = false;
  let currentLayer = 0;
  let layers: any = [
    //Bottom
    {
      //Structure is "x-y": ["tileset_x", "tileset_y"]
      //EXAMPLE: "1-1": [3, 4],
    },
    //Middle
    {},
    //Top
    {},
  ];
  useEffect(() => {
    // const canvas: any = document.querySelector("#editor-canvas");
    if (tilesetContainer.current) {
      tilesetContainer.current.addEventListener("mousedown", (event: any) => {
        selection = getCoords(event);
        if (tilesetSelection.current) {
          tilesetSelection.current.style.left = selection[0] * 32 + "px";
          tilesetSelection.current.style.top = selection[1] * 32 + "px";
        }
      });
    }

    if (canvas.current) {
      canvas.current.addEventListener("mousedown", () => {
        isMouseDown = true;
      });
      canvas.current.addEventListener("mouseup", () => {
        isMouseDown = false;
      });
      canvas.current.addEventListener("mouseleave", () => {
        isMouseDown = false;
      });
      canvas.current.addEventListener("mousedown", addTile);
      canvas.current.addEventListener("mousemove", (event: any) => {
        if (isMouseDown) {
          addTile(event);
        }
      });
    }

    if (tilesetImage.current) {
      tilesetImage.current.onload = function () {
        layers = defaultState;
        draw();
        setLayer(0);
      };
      tilesetImage.current.src = "images/editor/TileEditorSpritesheet.webp";
    }
  }, []);

  const addTile = (mouseEvent: any) => {
    const clicked = getCoords(event);
    const key = clicked[0] + "-" + clicked[1];
    if (mouseEvent.shiftKey) {
      delete layers[currentLayer][key];
    } else {
      layers[currentLayer][key] = [selection[0], selection[1]];
    }
    draw();
  };

  const getCoords = (e: any) => {
    const { x, y } = e.target.getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
  };

  const exportImage = () => {
    if (canvas.current) {
      const data = canvas.current.toDataURL();
      const image = new Image();
      image.src = data;

      const w: any = window.open("");
      w.document.write(image.outerHTML);
    }
  };

  const clearCanvas = () => {
    layers = [{}, {}, {}];
    draw();
  };

  const setLayer = (newLayer: any) => {
    currentLayer = newLayer;
    let oldActiveLayer: any = null;
    if (document) {
      oldActiveLayer = document.querySelector(".layer.active");
    }
    if (oldActiveLayer) {
      oldActiveLayer.classList.remove("active");
    }
    const tilelayer = document.querySelector(`[tile-layer="${currentLayer}"]`);
    if (tilelayer) {
      tilelayer.classList.add("active");
    }
  };

  const draw = () => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        const size_of_crop = 32;
        layers.forEach((layer: any) => {
          Object.keys(layer).forEach((key: any) => {
            //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
            const positionX = Number(key.split("-")[0]);
            const positionY = Number(key.split("-")[1]);
            const [tilesheetX, tilesheetY] = layer[key];
            const img: any = new Image();
            img.src = tilesetImage;
            ctx.drawImage(
              img,
              tilesheetX * 32,
              tilesheetY * 32,
              size_of_crop,
              size_of_crop,
              positionX * 32,
              positionY * 32,
              size_of_crop,
              size_of_crop
            );
          });
        });
      }
    }
  };
  return (
    <main>
      <div className="card">
        <header>
          <h1>Tile Map Editor</h1>
          <div>
            <button className="button-as-link" onClick={clearCanvas}>
              Clear Canvas
            </button>
            <button className="primary-button" onClick={exportImage}>
              Export Image
            </button>
          </div>
        </header>
        <div className="card_body">
          <aside>
            <label>Tiles</label>
            <div className="tileset-container" ref={tilesetContainer}>
              <img id="tileset-source" ref={tilesetImage} />
              <div
                className="tileset-container_selection"
                ref={tilesetSelection}
              ></div>
            </div>
          </aside>
          <div className="card_right-column">
            <canvas
              ref={canvas}
              id="editor-canvas"
              width="480"
              height="480"
            ></canvas>
            <p className="instructions">
              <strong>Click</strong> to paint.
              <strong>Shift+Click</strong> to remove.
            </p>
            <div>
              <label>Editing Layer:</label>
              <ul className="layers">
                <li>
                  <button
                    onClick={() => setLayer(2)}
                    className="layer"
                    // eslint-disable-next-line react/no-unknown-property
                    tile-layer="2"
                  >
                    Top Layer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLayer(1)}
                    className="layer"
                    // eslint-disable-next-line react/no-unknown-property
                    tile-layer="1"
                  >
                    Middle Layer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLayer(0)}
                    className="layer"
                    // eslint-disable-next-line react/no-unknown-property
                    tile-layer="0"
                  >
                    Bottom Layer
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
