import { SceneTransition } from "./SceneTransition";
import { TextMessage } from "./TextMessage";
import { utils } from "./Utils";

export class OverworldEvent {
  map: any;
  event: any;
  constructor({ map, event }: any) {
    this.map = map;
    this.event = event;
  }

  stand(resolve: () => void) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );
    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk() {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    );

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve: () => any) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(
        this.map.gameObjects["hero"].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector(".resume-world-container"));
  }

  changeMap(resolve: () => void) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(
      document.querySelector(".resume-world-container"),
      () => {
        this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
        resolve();
        sceneTransition.fadeOut();
      }
    );
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
