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
    getUsers({ provider = null } = {}) {
        if (provider) {
            return Object.keys(this.userDB[provider]).map(id => ({ provider: provider, id: id }));
        }
        else {
            return Object.keys(this.userDB).map(provider => this.getUsersByProvider(provider))
                .reduce((prev, cur) => prev.concat(cur), []);
        }
    }
    getUsersByProvider(provider) {
        return Object.keys(this.userDB[provider]).map(id => ({ provider: provider, id: id }));
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
class FakeAuthClientSessionStore {
}
exports.FakeAuthClientSessionStore = FakeAuthClientSessionStore;
class FakeAuthClientOptions {
}
exports.FakeAuthClientOptions = FakeAuthClientOptions;
class FakeAuthClient {
    constructor(options) {
        this.sessionStore = options.sessionStore;
        this.authServer = options.authServer;
        this.user = null;
        const userID = this.sessionStore.get('userID');
        if (userID) {
            this.user = {
                isNew: false,
                id: userID
            };
        }
        else {
            this.user = null;
        }
    }
    getLoggedInUser() {
        return this.user;
    }
    getLoginRequest({ provider, email }) {
        return {
            next: { complete: true },
            execute: () => __awaiter(this, void 0, void 0, function* () {
                var wasLoggedIn = !!this.user;
                this.user = yield this.authServer.authenticate({ provider: provider, email: email });
                if (!wasLoggedIn) {
                    this.sessionStore.set('userID', this.user.id);
                }
                var userIDS = this.sessionStore.get('userIDs');
                userIDS = userIDS || {};
                userIDS[this.user.id] = true;
                this.sessionStore.set('userIDs', userIDS);
                return { user: this.user };
            })
        };
    }
    getLogoutRequest({ id = null } = {}) {
        return {
            next: { complete: true },
            execute: () => {
                if (!this.user) {
                    return Promise.resolve();
                }
                if (id === null) {
                    id = this.user.id;
                }
                if (id === this.user.id) {
                    this.sessionStore.set('userID', undefined);
                }
                var userIDS = this.sessionStore.get('userIDs');
                userIDS = userIDS || {};
                delete userIDS[id];
                if (Object.keys(userIDS).length === 0) {
                    userIDS = undefined;
                }
                this.sessionStore.set('userIDs', userIDS);
                return Promise.resolve();
            }
        };
    }
}
exports.FakeAuthClient = FakeAuthClient;
//# sourceMappingURL=fake.js.map