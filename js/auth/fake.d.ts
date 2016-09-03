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
    getUsers({provider}?: {
        provider?: any;
    }): {
        provider: any;
        id: string;
    }[];
    getUsersByProvider(provider: any): {
        provider: any;
        id: string;
    }[];
    authenticate({provider, email}: {
        provider: any;
        email: any;
    }): Promise<{
        isNew: boolean;
        id: string;
    }>;
}
export declare class FakeAuthClientSessionStore {
    get: (key) => any;
    set: (key, value) => void;
}
export declare class FakeAuthClientOptions {
    sessionStore: FakeAuthClientSessionStore;
    authServer: FakeAuthServer;
}
export declare class FakeAuthClient implements AuthClient {
    private sessionStore;
    private authServer;
    private user;
    constructor(options: FakeAuthClientOptions);
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
    getLogoutRequest({id}?: {
        id?: any;
    }): {
        next: {
            complete: boolean;
        };
        execute: () => Promise<void>;
    };
}
