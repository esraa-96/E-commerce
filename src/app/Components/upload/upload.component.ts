import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uploadImage',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public progress: number;
  public message: string = "No file";
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  // baseURL = 'http://localhost:3104/api/upload';
  baseURL = 'https://sdera.azurewebsites.net/api/upload';

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(this.baseURL, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });
  }
}