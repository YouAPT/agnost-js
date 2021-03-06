export class SerialProcess {
  public name : string;
  
  constructor(public steps : Array<Function | SerialProcess>) {
  }
  
  static named(name, steps) {
    const process = new SerialProcess(steps);
    process.name = name;
    return process;
  }
  
  private _run({tracer = null}, ...args) {
    var ready = Promise.resolve(args);
    var first = true;

    this.steps.forEach((step) => {
      ready = ready.then((result) => {
        var func = step instanceof SerialProcess
                   ? (...args) => (tracer ? step.trace(tracer, ...args) : step.run(...args))
                   : step;
        var args = first ? result : [result];
        first = false;
        
        var funcResult = func(...args);
        if (!(funcResult instanceof Promise)) {
          funcResult = Promise.resolve(funcResult);
        }
        return funcResult.then(result => ({step, args, result}));
      }).then(({step, args, result}) => {
        if (tracer) {
          tracer({process: this.name, step, args, result});
        }
        
        return result;
      });
    });

    return ready;
  }
  
  run(...args) {
    return this._run({tracer: null}, ...args);
  }
  
  trace(tracer, ...args) {
    return this._run({tracer}, ...args);
  }
  
  slice({at = null, from = null, toInclusive = null, toExclusive = null}) : SerialProcess {
    if (at) {
      from = toInclusive = at;
    }
    
    var steps = [];
    var start = false;
    var stop = false;
    this.steps.forEach((step, index) => {
      if (!from || step.name === from || index === from) {
        start = true;
      }
      if (toExclusive && (step.name === toExclusive
                         || (index === toExclusive))) {
        stop = true;
      }
      if (start && !stop) {
        steps.push(step);
      }
      if (toInclusive && ((step.name && step.name === toInclusive)
                         || (index === toInclusive))) {
        stop = true;
      }
    });
    return new SerialProcess(steps);
  }
};
