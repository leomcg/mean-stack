import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api/posts'

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>(this.url)
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string }>(this.url, post)
      .subscribe((responseData) => {
        console.log(responseData.message)
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      })
  }
}