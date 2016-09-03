"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class FakeAuthServer {
    constructor(userDB = {}) {
        this.userDB = userDB;
    }
    getUserData({ provider, id }) {
        return this.userDB[provider] && this.userDB[provider][id];
    }
    setUserData({ provider, id, data }) {
        if (!this.userDB[provider]) {
            this.userDB[provider] = {};
        }
        this.userDB[provider][id] = data;
    }
    hasUser(params) {
        return Promise.resolve(!!this.getUserData(params));
    }
    authenticate({ provider, email }) {
        var user = {
            isNew: !this.getUserData({ provider: provider, id: email }),
            id: provider + ':' + email,
        };
        this.setUserData({ provider: provider, id: email, data: {} });
        return Promise.resolve(user);
    }
}
exports.FakeAuthServer = FakeAuthServer;
;
class FakeAuthClient {
    constructor({ sessionStore, authServer }) {
        this.sessionStore = sessionStore;
        this.authServer = authServer;
        this.user = null;
        const userID = sessionStore.get('userID');
        if (userID) {
            this.user = {
                isNew: false,
                id: userID
            };
        }
    }
    getLoggedInUser() {
        return this.user;
    }
    getLoginRequest({ provider, email }) {
        return {
            next: { complete: true },
            execute: () => __awaiter(this, void 0, void 0, function* () {
                this.user = yield this.authServer.authenticate({ provider: provider, email: email });
                this.sessionStore.set('userID', this.user.id);
                return { user: this.user };
            })
        };
    }
    getLogoutRequest() {
        return {
            next: { complete: true },
            execute: () => {
                this.sessionStore.set('userID', undefined);
                return Promise.resolve();
            }
        };
    }
}
exports.FakeAuthClient = FakeAuthClient;
//# sourceMappingURL=fake.js.map