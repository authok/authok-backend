export declare class ScriptManager {
    private readonly basePath;
    private cache;
    constructor(basePath: string);
    get(modName: string): Promise<string>;
    load(): Promise<void>;
}
