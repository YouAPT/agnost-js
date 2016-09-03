import {MailOptions} from '../mail';
import {MemoryMailSender} from '../mail/fake';

it('it has store mails, notify observers and destroy subscriptions', async () => {
    var sender = new MemoryMailSender();
    var sent = [];
    var observer = (options) => sent.push(options);
    var subscription = sender.observe(observer);
    
    var mail : MailOptions = {from: 'test@test.com', to: 'boo@test.com', subject: 'test', text: 'test'};
    await sender.send(mail);
    expect(sent).toEqual([mail]);
    expect(sender.mails).toEqual([mail]);
    
    subscription.destroy();
    var mail2 : MailOptions = {from: 'test@test.com', to: 'boo@test.com', subject: 'foo', text: 'bar'};
    await sender.send(mail2);
    expect(sent).toEqual([mail]);
    expect(sender.mails).toEqual([mail, mail2]);
});
