const events = new WeakMap();

export class EventEmitter {
    constructor() {
        events.set(this, new Map());
    }

    addListener(label: string, callback: Function, once: boolean) {
        if (
            typeof callback !== "function" ||
            typeof label !== "string" ||
            typeof once !== "boolean"
        ) {
            throw TypeError(
                "label must be a string, callback must be a function, once must be a boolean",
            );
        }

        this.emit("newListener", label, callback);

        const event = events.get(this);
        event.has(label) || event.set(label, new Map());

        const callbacks = event.get(label);
        callbacks.set(callback, once);

        if (callbacks.size > 10) {
            console.warn("more than 10 listeners in", this, "on", label);
        }
    }

    removeListener(label: string, callback: Function) {
        if (typeof callback !== "function" || typeof label !== "string") {
            throw TypeError("label must be a string, callback must be a function");
        }

        const event = events.get(this);
        const callbacks = event.get(label);

        if (callbacks) {
            return callbacks.delete(callback);
        }

        this.emit("removeListener", label, callback);
    }

    emit(label: string, ...args: any) {
        const event = events.get(this);

        const callbacks = event.get(label);
        if (callbacks) {
            // let consume = false;

            // args.unshift({
            // 	type: label,
            // 	consume: (value = true) => {
            // 		consume = value;
            // 	}
            // });

            for (const [callback, once] of callbacks) {
                if (once) {
                    callbacks.delete(callback);
                }
                const c = callback(...args);
                if (c === false) {
                    return true;
                }
            }
            return true;
        }
        return false;
    }

    on(label: string, callback: Function) {
        this.addListener(label, callback, false);
    }

    once(label: string, callback: Function) {
        this.addListener(label, callback, true);
    }

    off(label: string, callback: Function) {
        return this.removeListener(label, callback);
    }
}
