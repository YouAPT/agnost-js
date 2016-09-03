"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fake_1 = require('../mail/fake');
it('it has store mails, notify observers and destroy subscriptions', () => __awaiter(this, void 0, void 0, function* () {
    var sender = new fake_1.MemoryMailSender();
    var sent = [];
    var observer = (options) => sent.push(options);
    var subscription = sender.observe(observer);
    var mail = { from: 'test@test.com', to: 'boo@test.com', subject: 'test', text: 'test' };
    yield sender.send(mail);
    expect(sent).toEqual([mail]);
    expect(sender.mails).toEqual([mail]);
    subscription.destroy();
    var mail2 = { from: 'test@test.com', to: 'boo@test.com', subject: 'foo', text: 'bar' };
    yield sender.send(mail2);
    expect(sent).toEqual([mail]);
    expect(sender.mails).toEqual([mail, mail2]);
}));
//# sourceMappingURL=mail.js.map