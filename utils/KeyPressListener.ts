export class KeyPressListener {
  keydownFunction: (event: { code: any }) => void;
  keyupFunction: (event: any) => void;
  constructor(keyCode: string, callback: { (): void; (): void; (): void }) {
    let keySafe = true;
    this.keydownFunction = function (event: { code: any }) {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    };
    this.keyupFunction = function (event) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };
    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}
