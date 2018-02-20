import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
// import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';
import { User } from '../models/user.model';

@Injectable()
export class ChatService {
  user: firebase.User;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  userName: string;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { 
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
        this.getUser().valueChanges().subscribe(userInfo=>{
          this.userName = userInfo.displayName;
        })
      }
    });
  }

  getUser(): AngularFireObject<User> {
    const uid = this.user.uid;
    //console.log("uid: "+uid);
    const path = '/user/'+uid;
    //console.log("path: "+path);
    return this.db.object(path);
  }

  getUsers() {
    const path = '/users';
    return this.db.list(path);
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    console.log(this.chatMessages);

    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      email: email
    });

    console.log('Called sendMessage()!');
  }

  getMessages(): AngularFireList<ChatMessage> {
    return this.db.list('message', ref => ref.orderByKey().limitToLast(25));
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return new Date(date + ' ' + time);
  }

}
