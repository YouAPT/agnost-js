export declare class SerialProcess {
    steps: Array<Function | SerialProcess>;
    name: string;
    constructor(steps: Array<Function | SerialProcess>);
    static named(name: any, steps: any): SerialProcess;
    private _run({tracer}, ...args);
    run(...args: any[]): Promise<any[]>;
    trace(tracer: any, ...args: any[]): Promise<any[]>;
}
