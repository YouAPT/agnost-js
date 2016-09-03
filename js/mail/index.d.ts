export interface MailOptions {
    from: string;
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
}
export interface MailSender {
    send(options: MailOptions): Promise<void>;
}
