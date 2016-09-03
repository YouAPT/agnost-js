import { MailSender, MailOptions } from './';
export declare class MemoryMailSender implements MailSender {
    mails: any[];
    private observers;
    observe(observer: (options: MailOptions) => void): {
        destroy: () => void;
    };
    send(options: MailOptions): Promise<void>;
}
