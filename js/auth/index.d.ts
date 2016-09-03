export interface AuthRequestNextAction {
    complete?: boolean;
    popup?: boolean;
    redirect?: boolean;
}
export interface AuthRequest {
    next: AuthRequestNextAction;
    execute: () => Promise<any>;
}
export interface AuthUser {
    isNew: boolean;
    id: string;
}
export interface AuthClient {
    getLoggedInUser(): AuthUser;
    getLoginRequest(options: any): AuthRequest;
    getLogoutRequest(): AuthRequest;
}
