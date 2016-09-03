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
    var authServer = new fake_1.FakeAuthServer();
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer: authServer
    });
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({ provider: 'passwordless', email: 'test@test.com' });
    expect(request.next).toEqual({ complete: true });
    var result = yield request.execute();
    expect(result.user.isNew).toBe(true);
    expect(result.user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true });
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
}));
it('it has to be able to log in an existing user', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = {};
    var authServer = new fake_1.FakeAuthServer({ 'passwordless': { 'test@test.com': {} } });
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer: authServer
    });
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({ provider: 'passwordless', email: 'test@test.com' });
    expect(request.next).toEqual({ complete: true });
    var result = yield request.execute();
    expect(result.user.isNew).toBe(false);
    expect(result.user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true });
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
}));
it('it has to be able to resume sessions', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = { 'userID': 'passwordless:test@test.com',
        'userIDs': { 'passwordless:test@test.com': true } };
    var authServer = new fake_1.FakeAuthServer({ 'passwordless': { 'test@test.com': {} } });
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer: authServer
    });
    var user = auth.getLoggedInUser();
    expect(user).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true });
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
}));
it('it has to be able to log out', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = { 'userID': 'passwordless:test@test.com',
        'userIDs': { 'passwordless:test@test.com': true } };
    var authServer = new fake_1.FakeAuthServer({ 'passwordless': { 'test@test.com': {} } });
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer: authServer
    });
    var user = auth.getLoggedInUser();
    expect(user).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
    var request = auth.getLogoutRequest();
    expect(request.next).toEqual({ complete: true });
    yield request.execute();
    expect(sessionStore['userID']).toBe(undefined);
    expect(sessionStore['userIDs']).toEqual(undefined);
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
}));
it('it has to be able to log in multiple users', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = { 'userID': 'passwordless:test@test.com',
        'userIDs': { 'passwordless:test@test.com': true } };
    var authServer = new fake_1.FakeAuthServer({ 'passwordless': {
            'test@test.com': {},
        } });
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer: authServer
    });
    var user = auth.getLoggedInUser();
    expect(user).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true });
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
    var request = auth.getLoginRequest({ provider: 'passwordless', email: 'other@test.com' });
    expect(request.next).toEqual({ complete: true });
    var result = yield request.execute();
    expect(result.user.isNew).toBe(true);
    expect(result.user.id).toBe('passwordless:other@test.com');
    expect(auth.getLoggedInUser().id).toBe(result.user.id);
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'other@test.com' })).toBe(true);
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true,
        'passwordless:other@test.com': true });
}));
it('it has to be able to log out a secondary of multiple logged in users', () => __awaiter(this, void 0, void 0, function* () {
    var sessionStore = { 'userID': 'passwordless:test@test.com',
        'userIDs': { 'passwordless:test@test.com': true,
            'passwordless:other@test.com': true } };
    var authServer = new fake_1.FakeAuthServer({ 'passwordless': {
            'test@test.com': {},
            'other@test.com': {},
        } });
    var auth = new fake_1.FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer: authServer
    });
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true,
        'passwordless:other@test.com': true });
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'test@test.com' })).toBe(true);
    expect(yield authServer.hasUser({ provider: 'passwordless', id: 'other@test.com' })).toBe(true);
    var request = auth.getLogoutRequest({ id: 'passwordless:other@test.com' });
    expect(request.next).toEqual({ complete: true });
    yield request.execute();
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(sessionStore['userIDs']).toEqual({ 'passwordless:test@test.com': true });
}));
//# sourceMappingURL=auth.js.map