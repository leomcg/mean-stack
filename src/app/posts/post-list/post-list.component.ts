import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  currentPage = 1;
  isAuthenticated = false;
  private authSub: Subscription;

  constructor(public postsService: PostsService, private auth: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postsObject: {posts: Post[], totalPosts: number}) => {
        this.isLoading = false;
        this.posts = postsObject.posts;
        this.totalPosts = postsObject.totalPosts;
      });
    this.isAuthenticated = this.auth.getIsAuth();
    this.authSub = this.auth.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    })
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  onChangedPage($event: PageEvent) {
    this.isLoading = true;
    this.currentPage = $event.pageIndex + 1;
    this.postsPerPage = $event.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
