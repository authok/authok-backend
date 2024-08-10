export declare class VM2Sandbox {
    private vm;
    constructor(options?: Record<string, any>);
    run<T>(code: string): Promise<T | null>;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
}
