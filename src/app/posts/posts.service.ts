import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{ message: string, posts: any }>(this.url)
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          }
        })
      }))
      .subscribe(posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return {...this.posts.find(post => post.id = id)}
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string, postId: string }>(this.url, post)
      .subscribe((responseData) => {
        post.id = responseData.postId
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
        console.log(responseData.message)
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post = { id: id, title: title, content: content }
  }

  deletePost(postId: string) {
    this.http.delete(this.url + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      })
  }
}