import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient, private router: Router) {}

  updateAndNavigate() {
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  }

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
    return this.http.get<{_id: string, title: string, content: string}>(this.url + id);
  }

  addPost(title: string, content: string, image: File) {
    console.log('TITLE:' + title, 'CONTENT: ' + content, image)
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    console.log(postData)
    // this.http.
    //   post<{ message: string, postId: string }>(
    //     this.url, 
    //     postData
    //   )
    //   .subscribe((responseData) => {
    //     const post: Post = { 
    //       id: responseData.postId, 
    //       title: title, 
    //       content: content 
    //     };
    //     this.posts.push(post);
    //     console.log(responseData.message);
    //     this.updateAndNavigate();
    //   })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content }
    this.http.put(this.url + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.updateAndNavigate();
      })
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