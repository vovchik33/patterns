class SimpleEventEmitter {
    private readonly _listeners = new Map<string, Array<(data: number) => void>>();

    on(event: string, listener: (data: number) => void) {
        this._listeners.set(event, [...this._listeners.get(event) ?? [], listener]);
    }

    emit(event:string, data: number) {
        this._listeners.get(event)?.forEach(
            (handler) => handler(data)
        );
    }
}

const simpleEventEmitter = new SimpleEventEmitter();
simpleEventEmitter.on("event", (data) => console.log(data+data));
simpleEventEmitter.emit("event", 3);