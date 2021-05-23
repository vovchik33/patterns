import {strict} from "assert";


class TypedEventEmitter<EventEmitterType extends {[key: string]: unknown}> {
    private _listeners =
        new Map<any, Array<(data: EventEmitterType[any]) => void>>();

    on<EventType extends keyof EventEmitterType>(
        event: EventType,
        listener: (data: EventEmitterType[EventType]) => void,
    ): { unsubscribe: () => void } {
        let listeners = this._listeners.get(event);
        if (!listeners) {
            listeners = [];
            this._listeners.set(event, listeners);
        }
        listeners.push(listener);

        return {
            unsubscribe: () => {
                const findIndex = this._listeners.get(event)?.findIndex((item) => item === listener) ?? -1;
                if (findIndex >= 0) {
                    this._listeners.get(event)?.splice(findIndex, 1);
                } else {
                    console.warn(`No subscription were found for ${JSON.stringify(event)}`)
                }
            }
        }
    }

    emit<EventType extends keyof EventEmitterType>(
        event: EventType,
        data: EventEmitterType[EventType],
    ): void {
        this._listeners.get(event)?.forEach( listener => listener(data))
    }
}

enum SomeEvent {
    First = "first",
    Second = "second"
}
type TypedEvent = {
    say_hello: string ,
    add_numbers: number,
    congratulate: {
        age: number,
        name: string,
    } | string,
    event: SomeEvent,
}

const emitter = new TypedEventEmitter<TypedEvent>();
emitter.on("event", (data) => console.log(data));
emitter.on("say_hello", (data) => console.log(data.toUpperCase()));
emitter.on("add_numbers", (data) => console.log(data + data));
const unsubscriber = emitter.on("congratulate", (name) => console.log(name));
const unsubscriber1 = emitter.on("congratulate", (person) => console.log(`1${person}`));
const unsubscriber2 = emitter.on("congratulate", (person) => console.log(`2${person}`));
emitter.emit("say_hello", "asd");
emitter.emit("add_numbers", 2);
emitter.emit("congratulate", "Vovan");
emitter.emit("congratulate", {name: "Vovan", age: 40});
unsubscriber.unsubscribe();
unsubscriber.unsubscribe();
emitter.emit("congratulate", "Vovan");
emitter.emit("congratulate", {name: "Vovan", age: 40});
emitter.emit("event", SomeEvent.First);
emitter.emit("event", SomeEvent.Second);