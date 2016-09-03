import {AuthClient, AuthUser} from './';

export class FakeAuthClient implements AuthClient {
  private sessionStore;
  private userDB;
  private user : AuthUser;
  
  constructor({sessionStore, userDB}){
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
  
  getLoginRequest({provider, email}) {
    return {
      next: {complete: true},
      execute: () => {
        this.user = {
          isNew: !this.userDB.getUserData({provider, id: email}),
          id: email,
        };
        this.sessionStore.set('userID', provider + ':' + email);
        this.userDB.setUserData({provider, id: email, data: {}});
        
        return Promise.resolve({user: this.user});
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
