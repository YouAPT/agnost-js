"use strict";
class MemoryMailSender {
    constructor() {
        this.mails = [];
        this.observers = [];
    }
    observe(observer) {
        this.observers.push(observer);
        return {
            destroy: () => {
                this.observers = this.observers.filter(registered => registered !== observer);
            }
        };
    }
    send(options) {
        this.mails.push(options);
        this.observers.forEach(observer => observer(options));
        return Promise.resolve();
    }
}
exports.MemoryMailSender = MemoryMailSender;
//# sourceMappingURL=fake.js.map