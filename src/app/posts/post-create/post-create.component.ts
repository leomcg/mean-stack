import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {

  enteredTitle: string;
  enteredContent: string;
  private mode = 'create';
  private postId: string;
  public post: Post = {
    id: '',
    title: '',
    content: ''
  }

  constructor(private postsService: PostsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(post => {
          this.post = {id: post._id, title: post.title, content: post.content}
        });
      } else {
        this.mode = 'create';
        this.postId = paramMap.get(null);
      }
    })
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content)
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content)
    }
    form.resetForm()
  }
}