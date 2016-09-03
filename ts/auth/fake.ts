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
  
  authenticate({provider, email}) {
    var user = {
      isNew: !this.getUserData({provider, id: email}),
      id: provider + ':' + email,
    };
    this.setUserData({provider, id: email, data: {}});
    return Promise.resolve(user);
  }
};

export class FakeAuthClient implements AuthClient {
  private sessionStore;
  private authServer;
  private user : AuthUser;
  
  constructor({sessionStore, authServer}){
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
  
  getLoginRequest({provider, email}) {
    return {
      next: {complete: true},
      execute: async () => {
        this.user = await this.authServer.authenticate({provider, email});
        this.sessionStore.set('userID', this.user.id);
        
        return {user: this.user};
      }
    };
  }
  
  getLogoutRequest() {
    return {
      next: {complete: true},
      execute: () => {
        this.sessionStore.set('userID', undefined);
        return Promise.resolve();
      }
    };
  }
}
