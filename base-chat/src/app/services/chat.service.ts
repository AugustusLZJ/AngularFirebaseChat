import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';

@Injectable()
export class ChatService {
  user: any;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  userName: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { 
    /*this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
    });*/
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = 'test@example.com';
    this.chatMessages = this.getMessages();
    console.log(this.chatMessages);

    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      //userName: this.userName,
      userName: "test-user",
      email: email
    });

    console.log('Called sendMessage()!');
  }

  getMessages(): AngularFireList<ChatMessage> {
    return this.db.list('message', ref => ref.orderByKey().limitToLast(25));

    /*return this.db.list('message').snapshotChanges().map(actions => {
      return actions.map(action => action.orderByKey().limitToLast(25));
    });.subscribe(items => {
      return items.map(item => item.key);
    });

    var mlist: AngularFireList<ChatMessage>= [];
    console.log('Calling getMessages()...');
    //return this.db.list('message', ref => ref.orderByKey().limitToLast(25)).valueChanges();
    this.db.list('message', ref => ref.orderByKey().limitToLast(25)).valueChanges().subscribe(messages=>{
      console.log(messages);
      messages.forEach(message=>{
        mlist.push(message);
      });
    });
    console.log(mlist);
    return mlist;*/
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
