import { Ticker } from "./types";

// Define interfaces for different event data types
interface TickerData {
    lastPrice: string;
    high: string;
    low: string;
    volume: string;
    quoteVolume: string;
    symbol: string;
}

interface DepthData {
    bids: string[][];
    asks: string[][];
}

// Define callback types for each event
type CallbackMap = {
    ticker: (data: Partial<Ticker>) => void;
    depth: (data: DepthData) => void;
}

type EventName = keyof CallbackMap;

// Define the callback item structure
interface CallbackItem<T extends EventName> {
    callback: CallbackMap[T];
    id: string;
}

export const BASE_URL = "wss://ws.backpack.exchange/";

export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: any[] = [];
    private callbacks: {
        [K in EventName]?: Array<CallbackItem<K>>;
    } = {};
    private id: number;
    private initialized: boolean = false;

    private constructor() {
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new SignalingManager();
        }
        return this.instance;
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e as EventName;
            const callbacks = this.callbacks[type];

            if (callbacks) {
                callbacks.forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        };
                        (callback as CallbackMap['ticker'])(newTicker);
                    }
                    if (type === "depth") {
                        const depthData: DepthData = {
                            bids: message.data.b,
                            asks: message.data.a
                        };
                        (callback as CallbackMap['depth'])(depthData);
                    }
                });
            }
        }
    }

    sendMessage(message: any) {
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback<T extends EventName>(type: T, callback: CallbackMap[T], id: string) {
        if (!this.callbacks[type]) {
            this.callbacks[type] = [];
        }
        this.callbacks[type]!.push({ callback, id });
    }

    async deRegisterCallback(type: EventName, id: string) {
        const callbacks = this.callbacks[type];
        if (callbacks) {
            this.callbacks[type] = callbacks.filter(item => item.id !== id) as any;
        }
    }
}