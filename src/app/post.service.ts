import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ServiceNameService {
  constructor(private httpClient: HttpClient) { }
  
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endPointURL:string = 'https://training-angular-5c845-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endPointURL+'post.json';
  errorHandling = new Subject<any>();

  constructor(private http: HttpClient){}

  createAndPost(postData: Post){
    console.log(postData);
    this.http.post<{name: string}>(this.postURL, postData, {
      observe: 'response', // default is body
      responseType: 'json'
    })
    .subscribe(
      (data) => {
        console.log(data);
        this.errorHandling.next(null);
      },
      (error) => {
        this.errorHandling.next(error);
      }
    );
  }

  putPost(postData: Post){
    console.log(postData);
    const data = {
      [postData.id]:{
        content: postData.content,
        title: postData.title
      }
    }
    this.http.put(this.postURL, data)
    .subscribe(
      (data) => {
        console.log(data);
        this.errorHandling.next(null);
      },
      (error) => {
        this.errorHandling.next(error);
      }      
    );
  }

  patchPost(postData: Post){
    console.log(postData);
    const data = {
      [postData.id]:{
        content: postData.content,
        title: postData.title
      }
    }
    this.http.patch(this.postURL, data)
    .subscribe(
      (data) => {
        console.log(data);
        this.errorHandling.next(null);
      },
      (error) => {
        this.errorHandling.next(error);
      }
    );
  }

  fetchPosts(){
    let customParam = new HttpParams();
    customParam = customParam.append('print', 'pretty');
    customParam = customParam.append('custom-param', 'custom-param-value');

    return this.http.get<{[key: string] : Post}>(this.postURL, {
      headers: new HttpHeaders({
        'custom-header' : 'hello from custom header'
      }),
      params: customParam
    })
    .pipe(
      map( responseData => {
        const postArray: Post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key], id: key})
          }
        }
        return postArray;
      })
    )
  }

  deletePosts(){
    return this.http.delete(this.postURL, {
      observe : 'events'
    })
    .pipe(
      tap(
        event => {
          console.log(event);
          if(event.type === HttpEventType.Sent){

          }

          if(event.type === HttpEventType.Response){
            console.log(event.body)
          }
        }
      )
    );
  }
}
