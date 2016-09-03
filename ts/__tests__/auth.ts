import {FakeAuthClient} from '../auth/fake';

it('it has to be able to log in a new user', async () => {
    var sessionStore = {};
    var userDB = {};
    
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => { sessionStore[key] = value; }
        },
        userDB: {
            getUserData: ({provider, id}) => userDB[provider] && userDB[provider][id],
            setUserData: ({provider, id, data}) => {
                if (!userDB[provider]) {
                    userDB[provider] = {};
                }
                userDB[provider][id] = data
            }
        }
    });
    
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({provider: 'passwordless', email: 'test@test.com'});
    expect(request.next).toEqual({complete: true});
    var result = await request.execute();
    expect(result.user.isNew).toBe(true);
    expect(result.user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({'test@test.com': {}});
});

it('it has to be able to log in an existing user', async () => {
    var sessionStore = {};
    var userDB = {'passwordless': {'test@test.com': {}}};
    
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        userDB: {
            getUserData: ({provider, id}) => userDB[provider][id],
            setUserData: ({provider, id, data}) => userDB[provider][id] = data
        }
    });
    
    expect(auth.getLoggedInUser()).toBe(null);
    var request = auth.getLoginRequest({provider: 'passwordless', email: 'test@test.com'});
    expect(request.next).toEqual({complete: true});
    var result = await request.execute();
    expect(result.user.isNew).toBe(false);
    expect(result.user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({'test@test.com': {}});
});

it('it has to be able to resume sessions', async () => {
    var sessionStore = {'userID': 'passwordless:test@test.com'};
    var userDB = {'passwordless': {'test@test.com': {}}};
    
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        userDB: {
            getUserData: ({provider, id}) => userDB[provider][id],
            setUserData: ({provider, id, data}) => userDB[provider][id] = data
        }
    });
    
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({'test@test.com': {}});
});

it('it has to be able to log out', async () => {
    var sessionStore = {'userID': 'passwordless:test@test.com'};
    var userDB = {'passwordless': {'test@test.com': {}}};
    
    var auth : any = new FakeAuthClient({
        sessionStore: {
            get: (key) => sessionStore[key],
            set: (key, value) => sessionStore[key] = value
        },
        userDB: {
            getUserData: ({provider, id}) => userDB[provider][id],
            setUserData: ({provider, id, data}) => userDB[provider][id] = data
        }
    });
    
    var user = auth.getLoggedInUser();
    expect(auth.getLoggedInUser()).not.toBe(null);
    expect(user.isNew).toBe(false);
    expect(user.id).toBe('test@test.com');
    expect(sessionStore['userID']).toBe('passwordless:test@test.com');
    expect(userDB['passwordless']).toEqual({'test@test.com': {}});
    
    var request = auth.getLogoutRequest();
    expect(request.next).toEqual({complete: true});
    await request.execute();
    expect(sessionStore['user']).toBe(undefined);
    expect(userDB['passwordless']).toEqual({'test@test.com': {}});
});

