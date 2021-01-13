import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment"
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], totalPosts: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number = 5, currentPage: number = 1) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, totalPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                userName: post.userName
              };
            }),
            totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts], totalPosts: transformedPostsData.totalPosts});
      });
  }

  getPostsByCreator(postsPerPage: number, currentPage: number, creator) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, totalPosts: number }>(BACKEND_URL + "user/" + creator + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                userName: post.userName
              };
            }),
            totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts], totalPosts: transformedPostsData.totalPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string, userName: string }>(
      BACKEND_URL + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        console.log(responseData)
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
        userName: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
