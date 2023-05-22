import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostService } from './post.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  loadedPosts = [];
  showLoading = false;
  updateForm! : FormGroup;
  error = null;
  errorSub: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.updateForm = new FormGroup({
      'id' : new FormControl(null, Validators.required),
      'title' : new FormControl(null, Validators.required),
      'content' : new FormControl(null, Validators.required)
    });

    this.errorSub = this.postService.errorHandling.subscribe(
      error => {
        this.error = error;
      }
    );
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onPostClicked(post) {
    this.updateForm.get('id').setValue(post.id);
    this.updateForm.get('title').setValue(post.title);
    this.updateForm.get('content').setValue(post.content);
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndPost(postData);
  }

  onUpdatePost() {
    let post: Post = {
      id: this.updateForm.get('id').value,
      content : this.updateForm.get('content').value,
      title : this.updateForm.get('title').value
    };

    this.postService.patchPost(post);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.deletePosts().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      }
    );
  }

  private fetchPosts(){
    this.showLoading = true;
    this.postService.fetchPosts()
    .subscribe(
      posts => {
        // setTimeout(() => {
        //   this.showLoading = false;
        //   this.loadedPosts = posts;
        // },3000);
        this.showLoading = false;
        this.error = null;
        this.loadedPosts = posts;
      }, 
      error => {
        console.log(error);
        this.error = error;
      }
    );
  }
}
