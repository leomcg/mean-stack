import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsSubscription: Subscription;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe(posts => this.posts = posts)
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

}
