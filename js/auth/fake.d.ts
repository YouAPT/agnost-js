import { AuthClient, AuthUser } from './';
export interface FakeAuthServerProviderData {
    [id: string]: any;
}
export interface FakeAuthServerData {
    [provider: string]: FakeAuthServerProviderData;
}
export declare class FakeAuthServer {
    private userDB;
    constructor(userDB?: FakeAuthServerData);
    private getUserData({provider, id});
    private setUserData({provider, id, data});
    hasUser(params: any): Promise<boolean>;
    authenticate({provider, email}: {
        provider: any;
        email: any;
    }): Promise<{
        isNew: boolean;
        id: string;
    }>;
}
export declare class FakeAuthClient implements AuthClient {
    private sessionStore;
    private authServer;
    private user;
    constructor({sessionStore, authServer}: {
        sessionStore: any;
        authServer: any;
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
