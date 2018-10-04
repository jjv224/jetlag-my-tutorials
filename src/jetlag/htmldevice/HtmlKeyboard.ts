import { JetLagKeys, JetLagKeyboard } from "../misc/JetLagDevice";

/**
 * Keyboard abstracts the ways of responding to keyboard events
 */
export class HtmlKeyboard implements JetLagKeyboard {
    /** handlers for when keys are pressed down */
    downHandlers: (() => void)[] = [];

    /** handlers for when keys are released */
    upHandlers: (() => void)[] = [];

    /** Set a handler to respond to some keydown event */
    public setKeyDownHandler(key: JetLagKeys, handler: () => void) { this.downHandlers[key.valueOf() as number] = handler; }

    /** Set a handler to respond to some keyup event */
    public setKeyUpHandler(key: JetLagKeys, handler: () => void) { this.upHandlers[key.valueOf() as number] = handler; }

    /**
     * Convert a key code to KEYS enum
     */
    private toCode(code: number): number {
        let idx = -1;
        switch (code) {
            case 27: idx = JetLagKeys.ESCAPE; break;
            case 38: idx = JetLagKeys.UP; break;
            case 40: idx = JetLagKeys.DOWN; break;
            case 37: idx = JetLagKeys.LEFT; break;
            case 39: idx = JetLagKeys.RIGHT; break;
            case 32: idx = JetLagKeys.SPACE; break;
            default: idx = -1; break;
        }
        return idx;
    }

    /**
     * Respond to a key down event
     */
    private keyDownHandler(ev: KeyboardEvent) {
        let idx = this.toCode(ev.keyCode);
        if (idx != -1) {
            let h = this.downHandlers[idx];
            if (h !== null) {
                h();
                ev.preventDefault();
            }
        }
    }

    /**
     * Respond to a key up event
     */
    private keyUpHandler(ev: KeyboardEvent) {
        let idx = this.toCode(ev.keyCode);
        if (idx != -1) {
            let h = this.upHandlers[idx];
            if (h !== null) {
                h();
                ev.preventDefault();
            }
        }
    }

    /** 
     * Build the Keyboard handler object
     */
    constructor() {
        for (let o = 0; o < JetLagKeys.COUNT; ++o) {
            this.upHandlers.push(null);
            this.downHandlers.push(null);
        }
        document.addEventListener("keydown", (ev: KeyboardEvent) => this.keyDownHandler(ev));
        document.addEventListener("keyup", (ev: KeyboardEvent) => this.keyUpHandler(ev));
    }
}