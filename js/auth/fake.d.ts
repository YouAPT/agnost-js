import { AuthClient, AuthUser } from './';
export declare class FakeAuthClient implements AuthClient {
    private sessionStore;
    private userDB;
    private user;
    constructor({sessionStore, userDB}: {
        sessionStore: any;
        userDB: any;
    });
    getLoggedInUser(): AuthUser;
    getLoginRequest({provider, email}: {
        provider: any;
        email: any;
    }): {
        next: {
            complete: boolean;
        };
        execute: () => Promise<{
            user: AuthUser;
        }>;
    };
    getLogoutRequest(): {
        next: {
            complete: boolean;
        };
        execute: () => Promise<void>;
    };
}
