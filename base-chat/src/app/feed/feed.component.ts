import { Component, OnInit } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChatService } from '../services/chat.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {
  feed: Observable<ChatMessage[]>;

  constructor(private chat: ChatService) { }

  ngOnInit() {
    console.log('Feed Init');
    this.feed = this.chat.getMessages().valueChanges();
    console.log("Feed Content: "+this.feed);
  }

  ngOnChanges() {
    console.log('update feed');
    this.feed = this.chat.getMessages().valueChanges();
  }

}
