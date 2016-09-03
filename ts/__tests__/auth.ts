import {FakeAuthClient, FakeAuthServer} from '../auth/fake';

it('it has to be able to log in a new user', async () => {
    var sessionStore = {};
    
    var authServer = new FakeAuthServer();
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => { sessionStore[key] = value; }
        },
        authServer
    });
    
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({provider: 'passwordless', email: 'test@test.com'});
    expect(request.next).toEqual({complete: true});
    var result = await request.execute();
    expect(result.user.isNew).toBe(true);
    expect(result.user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(await authServer.hasUser({provider: 'passwordless', id: 'test@test.com'})).toBe(true);
});

it('it has to be able to log in an existing user', async () => {
    var sessionStore = {};
    
    var authServer = new FakeAuthServer({'passwordless': {'test@test.com': {}}});
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer
    });
    
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({provider: 'passwordless', email: 'test@test.com'});
    expect(request.next).toEqual({complete: true});
    var result = await request.execute();
    expect(result.user.isNew).toBe(false);
    expect(result.user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(await authServer.hasUser({provider: 'passwordless', id: 'test@test.com'})).toBe(true);
});

it('it has to be able to resume sessions', async () => {
    var sessionStore = {'userID': 'passwordless:test@test.com'};
    
    var authServer = new FakeAuthServer({'passwordless': {'test@test.com': {}}});
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer
    });
    
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(await authServer.hasUser({provider: 'passwordless', id: 'test@test.com'})).toBe(true);
});

it('it has to be able to log out', async () => {
    var sessionStore = {'userID': 'passwordless:test@test.com'};
    
    var authServer = new FakeAuthServer({'passwordless': {'test@test.com': {}}});
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        authServer
    });
    
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('passwordless:test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(await authServer.hasUser({provider: 'passwordless', id: 'test@test.com'})).toBe(true);
    
    var request = auth.getLogoutRequest();
    expect(request.next).toEqual({complete: true});
    await request.execute();
    expect(sessionStore['user']).toBe(undefined);
    expect(await authServer.hasUser({provider: 'passwordless', id: 'test@test.com'})).toBe(true);
});

