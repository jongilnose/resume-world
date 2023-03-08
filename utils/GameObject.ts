import { OverworldEvent } from "./OverworldEvent";
import { Sprite } from "./Sprite";

export class GameObject {
  id: null;
  isMounted: boolean;
  x: any;
  y: any;
  direction: any;
  sprite: any;
  behaviorLoop: any;
  behaviorLoopIndex: number;
  talking: any;
  isStanding: any;
  constructor(config: {
    x: number;
    y: number;
    direction: string;
    src: any;
    behaviorLoop: never[];
    talking: never[];
  }) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/people/hero.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map: { addWall: (arg0: any, arg1: any) => void }) {
    console.log("mounting!");
    this.isMounted = true;
    map.addWall(this.x, this.y);

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      return this.doBehaviorEvent(map);
    }, 10);
  }

  async doBehaviorEvent(map: { isCutscenePlaying: any }) {
    if (
      map.isCutscenePlaying ||
      this.behaviorLoop.length === 0 ||
      this.isStanding
    ) {
      return;
    }

    const eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }
}
