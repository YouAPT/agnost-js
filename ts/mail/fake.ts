import {MailSender, MailOptions} from './';

export class MemoryMailSender implements MailSender {
    public mails = [];
    private observers = [];
    
    observe(observer : (options : MailOptions) => void) {
        this.observers.push(observer);
        return {
            destroy: () => {
                this.observers = this.observers.filter(registered => registered !== observer)
            }
        }
    }
    
    send(options : MailOptions) {
        this.mails.push(options);
        this.observers.forEach(observer => observer(options))
        return Promise.resolve();
    }
}
