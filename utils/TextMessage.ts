import { KeyPressListener } from "./KeyPressListener";
import { RevealingText } from "./RevealingText";

export class TextMessage {
  text: any;
  onComplete: any;
  element: any;
  revealingText: any;
  actionListener: any;
  constructor({ text, onComplete }: any) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class="TextMessage_p"></p>
      <button class="TextMessage_button">Next</button>
    `;

    //Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text,
      speed: 60,
    });

    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container: { appendChild: (arg0: any) => void }) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
