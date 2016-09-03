"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fake_1 = require('../auth/fake');
it('it has to be able to log in a new user', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = {};
    var userDB = {};
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => { sessionStore[key] = value; }
        },
        userDB: {
            getUserData: ({ provider, id }) => userDB[provider] && userDB[provider][id],
            setUserData: ({ provider, id, data }) => {
                if (!userDB[provider]) {
                    userDB[provider] = {};
                }
                userDB[provider][id] = data;
            }
        }
    });
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({ provider: 'passwordless', email: 'test@test.com' });
    expect(request.next).toEqual({ complete: true });
    var result = yield request.execute();
    expect(result.user.isNew).toBe(true);
    expect(result.user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({ 'test@test.com': {} });
}));
it('it has to be able to log in an existing user', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = {};
    var userDB = { 'passwordless': { 'test@test.com': {} } };
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        userDB: {
            getUserData: ({ provider, id }) => userDB[provider][id],
            setUserData: ({ provider, id, data }) => userDB[provider][id] = data
        }
    });
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({ provider: 'passwordless', email: 'test@test.com' });
    expect(request.next).toEqual({ complete: true });
    var result = yield request.execute();
    expect(result.user.isNew).toBe(false);
    expect(result.user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({ 'test@test.com': {} });
}));
it('it has to be able to resume sessions', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = { 'userID': 'passwordless:test@test.com' };
    var userDB = { 'passwordless': { 'test@test.com': {} } };
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        userDB: {
            getUserData: ({ provider, id }) => userDB[provider][id],
            setUserData: ({ provider, id, data }) => userDB[provider][id] = data
        }
    });
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({ 'test@test.com': {} });
}));
it('it has to be able to log out', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = { 'userID': 'passwordless:test@test.com' };
    var userDB = { 'passwordless': { 'test@test.com': {} } };
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        userDB: {
            getUserData: ({ provider, id }) => userDB[provider][id],
            setUserData: ({ provider, id, data }) => userDB[provider][id] = data
        }
    });
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({ 'test@test.com': {} });
    var request = auth.getLogoutRequest();
    expect(request.next).toEqual({ complete: true });
    yield request.execute();
    expect(sessionStore['user']).toBe(undefined);
    expect(userDB['passwordless']).toEqual({ 'test@test.com': {} });
}));
//# sourceMappingURL=auth.js.map