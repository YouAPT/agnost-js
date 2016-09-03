"use strict";
class FakeAuthClient {
    constructor({ sessionStore, userDB }) {
        this.sessionStore = sessionStore;
        this.userDB = userDB;
        this.user = null;
        const userID = sessionStore.get('userID');
        if (userID) {
            this.user = {
                isNew: false,
                id: userID.split(':')[1]
            };
        }
    }
    getLoggedInUser() {
        return this.user;
    }
    getLoginRequest({ provider, email }) {
        return {
            next: { complete: true },
            execute: () => {
                this.user = {
                    isNew: !this.userDB.getUserData({ provider: provider, id: email }),
                    id: email,
                };
                this.sessionStore.set('userID', provider + ':' + email);
                this.userDB.setUserData({ provider: provider, id: email, data: {} });
                return Promise.resolve({ user: this.user });
            }
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