import {SerialProcess} from '../process';

it('runs a simple asynchronous process', async () => {
  const process = new SerialProcess([
      () => Promise.resolve(1),
      (prev) => Promise.resolve(prev + 1),
      (prev) => Promise.resolve(prev + 1),
  ]);
  expect(await process.run()).toBe(3);
});

it('runs a simple synchronous process', async () => {
  const process = new SerialProcess([
      () => 1,
      (prev) => prev + 1,
      (prev) => prev + 1,
  ]);
  expect(await process.run()).toBe(3);
});

it('runs a simple synchronous process with a inital arguments', async () => {
  const process = new SerialProcess([
      (a, b) => a + b,
      (prev) => prev + 1,
  ]);
  expect(await process.run(1, 1)).toBe(3);
});

it('runs a simple mixed (a)synchronous process', async () => {
  const process = new SerialProcess([
      () => Promise.resolve(1),
      (prev) => prev + 1,
      (prev) => Promise.resolve(prev + 1),
  ]);
  expect(await process.run()).toBe(3);
});

it('runs a nested process', async () => {
  const process = new SerialProcess([
      () => 1,
      new SerialProcess([
          (prev) => prev + 1
      ]),
      (prev) => Promise.resolve(prev + 1),
  ]);
  expect(await process.run()).toBe(3);
});

it('can generate a trace of a process', async () => {
  const process = new SerialProcess([
    () => Promise.resolve(1),
    (prev) => prev + 1,
    (prev) => Promise.resolve(prev + 1),
  ]);
  
  const trace = [];
  expect(await process.trace(({args, result}) => {trace.push({args, result})})).toBe(3);
  expect(trace).toEqual([
      {args: [], result: 1},
      {args: [1], result: 2},
      {args: [2], result: 3},
  ]);
});

it('can generate a trace of a nested process', async () => {
  const process = new SerialProcess([
      () => 1,
      new SerialProcess([
          (prev) => prev + 1,
          (prev) => prev + 1
      ]),
      (prev) => Promise.resolve(prev + 1),
  ]);
  
  const trace = [];
  expect(await process.trace(({args, result}) => {trace.push({args, result})})).toBe(4);
  expect(trace).toEqual([
      {args: [], result: 1},
      {args: [1], result: 2},
      {args: [2], result: 3},
      {args: [1], result: 3},
      {args: [3], result: 4},
  ]);
});

it('can generate a trace of named nested process', async () => {
  const process = SerialProcess.named('root', [
      () => 1,
      SerialProcess.named('child', [
          function first(prev) { return prev + 1 },
          (prev) => prev + 1
      ]),
      (prev) => Promise.resolve(prev + 1),
  ]);
  
  const trace = [];
  expect(await process.trace(({process, step, args, result}) => {trace.push({
      step: step.name,
      process,
      args,
      result
  })})).toBe(4);
  expect(trace).toEqual([
      {process: 'root', step: '', args: [], result: 1},
      {process: 'child', step: 'first', args: [1], result: 2},
      {process: 'child', step: '', args: [2], result: 3},
      {process: 'root', step: 'child', args: [1], result: 3},
      {process: 'root', step: '', args: [3], result: 4},
  ]);
});

