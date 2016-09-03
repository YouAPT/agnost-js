"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const process_1 = require('../process');
it('runs a simple asynchronous process', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            () => Promise.resolve(1),
            (prev) => Promise.resolve(prev + 1),
            (prev) => Promise.resolve(prev + 1),
    ]);
    expect(yield process.run()).toBe(3);
}));
it('runs a simple synchronous process', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            () => 1,
            (prev) => prev + 1,
            (prev) => prev + 1,
    ]);
    expect(yield process.run()).toBe(3);
}));
it('runs a simple synchronous process with a inital arguments', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            (a, b) => a + b,
            (prev) => prev + 1,
    ]);
    expect(yield process.run(1, 1)).toBe(3);
}));
it('runs a simple mixed (a)synchronous process', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            () => Promise.resolve(1),
            (prev) => prev + 1,
            (prev) => Promise.resolve(prev + 1),
    ]);
    expect(yield process.run()).toBe(3);
}));
it('runs a nested process', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            () => 1,
        new process_1.SerialProcess([
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    expect(yield process.run()).toBe(3);
}));
it('can generate a trace of a process', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            () => Promise.resolve(1),
            (prev) => prev + 1,
            (prev) => Promise.resolve(prev + 1),
    ]);
    const trace = [];
    expect(yield process.trace(({ args, result }) => { trace.push({ args: args, result: result }); })).toBe(3);
    expect(trace).toEqual([
        { args: [], result: 1 },
        { args: [1], result: 2 },
        { args: [2], result: 3 },
    ]);
}));
it('can generate a trace of a nested process', () => __awaiter(this, void 0, void 0, function* () {
    const process = new process_1.SerialProcess([
            () => 1,
        new process_1.SerialProcess([
                (prev) => prev + 1,
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    const trace = [];
    expect(yield process.trace(({ args, result }) => { trace.push({ args: args, result: result }); })).toBe(4);
    expect(trace).toEqual([
        { args: [], result: 1 },
        { args: [1], result: 2 },
        { args: [2], result: 3 },
        { args: [1], result: 3 },
        { args: [3], result: 4 },
    ]);
}));
it('can generate a trace of named nested process', () => __awaiter(this, void 0, void 0, function* () {
    const process = process_1.SerialProcess.named('root', [
            () => 1,
        process_1.SerialProcess.named('child', [
            function first(prev) { return prev + 1; },
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    const trace = [];
    expect(yield process.trace(({ process, step, args, result }) => {
        trace.push({
            step: step.name,
            process: process,
            args: args,
            result: result
        });
    })).toBe(4);
    expect(trace).toEqual([
        { process: 'root', step: '', args: [], result: 1 },
        { process: 'child', step: 'first', args: [1], result: 2 },
        { process: 'child', step: '', args: [2], result: 3 },
        { process: 'root', step: 'child', args: [1], result: 3 },
        { process: 'root', step: '', args: [3], result: 4 },
    ]);
}));
it('can run an inclusive range slice of a process', () => __awaiter(this, void 0, void 0, function* () {
    const process = process_1.SerialProcess.named('root', [
            () => 1,
        process_1.SerialProcess.named('child', [
            function first(prev) { return prev + 1; },
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    const slice = process.slice({ from: 'child', toInclusive: 2 });
    expect(yield slice.run(4)).toBe(7);
}));
it('can run an exclusive range slice of a process', () => __awaiter(this, void 0, void 0, function* () {
    const process = process_1.SerialProcess.named('root', [
            () => 1,
        process_1.SerialProcess.named('child', [
            function first(prev) { return prev + 1; },
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    const slice = process.slice({ from: 0, toExclusive: 2 });
    expect(yield slice.run()).toBe(3);
}));
it('can run an range of a process with only a start', () => __awaiter(this, void 0, void 0, function* () {
    const process = process_1.SerialProcess.named('root', [
            () => 1,
        process_1.SerialProcess.named('child', [
            function first(prev) { return prev + 1; },
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    const slice = process.slice({ from: 1 });
    expect(yield slice.run(5)).toBe(8);
}));
it('can run an slice at an index', () => __awaiter(this, void 0, void 0, function* () {
    const process = process_1.SerialProcess.named('root', [
            () => 1,
        process_1.SerialProcess.named('child', [
            function first(prev) { return prev + 1; },
                (prev) => prev + 1
        ]),
            (prev) => Promise.resolve(prev + 1),
    ]);
    const slice = process.slice({ at: 'child' });
    expect(yield slice.run(5)).toBe(7);
}));
//# sourceMappingURL=process.js.map