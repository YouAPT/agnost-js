import {AuthClient, AuthUser} from './';

export interface FakeAuthServerProviderData {
  [id : string] : any;
}

export interface FakeAuthServerData {
  [provider : string] : FakeAuthServerProviderData;
}

export class FakeAuthServer {
  constructor(private userDB : FakeAuthServerData = {}){
  }
  
  private getUserData({provider, id}) {
    return this.userDB[provider] && this.userDB[provider][id];
  }
  
  private setUserData({provider, id, data}) {
    if (!this.userDB[provider]) {
        this.userDB[provider] = {};
    }
    this.userDB[provider][id] = data
  }
  
  hasUser(params) {
    return Promise.resolve(!!this.getUserData(params));
  }
  
  getUsers({provider = null} = {}) {
    if (provider) {
      return Object.keys(this.userDB[provider]).map(id => ({provider, id}));
    } else {
      return Object.keys(this.userDB).map(provider => this.getUsersByProvider(provider))
                                                          .reduce((prev, cur) => prev.concat(cur), []);
    }
  }
  
  getUsersByProvider(provider) {
    return Object.keys(this.userDB[provider]).map(id => ({provider, id}));
  }
  
  authenticate({provider, email}) {
    var user = {
      isNew: !this.getUserData({provider, id: email}),
      id: provider + ':' + email,
    };
    this.setUserData({provider, id: email, data: {}});
    return Promise.resolve(user);
  }
};

export class FakeAuthClientSessionStore {
  get : (key) => any;
  set : (key, value) => void;
}

export class FakeAuthClientOptions {
  sessionStore : FakeAuthClientSessionStore;
  authServer : FakeAuthServer;
}

export class FakeAuthClient implements AuthClient {
  private sessionStore : FakeAuthClientSessionStore;
  private authServer : FakeAuthServer;
  private user : AuthUser;
  
  constructor(options : FakeAuthClientOptions){
    this.sessionStore = options.sessionStore;
    this.authServer = options.authServer;
    this.user = null;
    
    const userID = this.sessionStore.get('userID');
    if (userID) {
      this.user = {
        isNew: false,
        id: userID
      };
    } else {
      this.user = null;
    }
  }
  
  getLoggedInUser() {
    return this.user;
  }
  
  getLoginRequest({provider, email}) {
    return {
      next: {complete: true},
      execute: async () => {
        var wasLoggedIn = !!this.user;
        this.user = await this.authServer.authenticate({provider, email});
        if (!wasLoggedIn) {
          this.sessionStore.set('userID', this.user.id);
        }
        
        var userIDS = this.sessionStore.get('userIDs');
        userIDS = userIDS || {};
        userIDS[this.user.id] = true;
        
        this.sessionStore.set('userIDs', userIDS);
        
        return {user: this.user};
      }
    };
  }
  
  getLogoutRequest({id = null} = {}) {
    return {
      next: {complete: true},
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
        
        if(Object.keys(userIDS).length === 0){
          userIDS = undefined;
        }
        
        this.sessionStore.set('userIDs', userIDS);
        
        return Promise.resolve();
      }
    };
  }
}
