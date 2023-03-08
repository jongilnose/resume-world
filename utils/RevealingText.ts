export class RevealingText {
  element: any;
  text: any;
  speed: number;
  timeout: any;
  isDone: boolean;
  constructor(config: { element: any; text: any; speed: number }) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 60;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list: any[]) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element
      .querySelectorAll("span")
      .forEach((s: { classList: { add: (arg0: string) => void } }) => {
        s.classList.add("revealed");
      });
  }

  init() {
    const characters: { span: HTMLSpanElement; delayAfter: number }[] = [];
    this.text.split("").forEach((character: string | null) => {
      //Create each span, add to element in DOM
      const span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span);

      //Add this span to our internal state Array
      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}
