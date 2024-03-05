import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { BaseUrls } from '../base-urls';
import { Users } from '../models/users';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  public user: Users | null = JSON.parse(localStorage.getItem("user") || "{}");
  public cars: any[] = [];


  // wishlistsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // wishlistsRetreived: boolean = false;

  allDocumentsRetrieved: boolean = false;
  filesSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  sharedFilesSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  directorySub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  constructor(
    private http: HttpClient,
    private toast: ToastrService,
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user);
    
    if(this.user.access > 0) {
      this.getAllFiles();
      this.getAllSharedFiles();
    }
  }

  getAllFiles() {
    this.http
      .get(
        `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/getAllFiles?rootFolderName=${this.user['email']}&isSubFolder=${false}`
      )
      .subscribe({
        next: (value: any[]) => {
          this.filesSub.next(value);
          this.directorySub.next(value.filter(x => x.isDirectory))
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getAllSharedFiles() {
    this.http
      .get(
        `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/get-all-shared-files?rootFolderName=${this.user['email']}`
      )
      .subscribe({
        next: (value: any[]) => {
          this.sharedFilesSub.next(value);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  downloadEncryptedFile(filepath: string) {
    this.http
      .get(
        `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/get-encrypted-file?filePath=${filepath}`
      )
      .subscribe({
        next: (value: any) => {
          // console.log(value);
          this.saveFile(value);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  downloadDecryptedFile(filepath: string, secretKey?: string) {
    let formData = new FormData();
    formData.append('filePath', filepath);
    formData.append('secretKey', secretKey ?? this.user.secretKey);

    this.http
      .post(
        `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/get-decrypted-file`,
        formData
      )
      .subscribe({
        next: (value: any) => {
          // console.log(value);
          this.saveFile(value);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  saveFile(fileInfo) {
    const byteString = window.atob(fileInfo['content']);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let idx = 0; idx < byteString.length; idx++) {
      uintArray[idx] = byteString.charCodeAt(idx);
    }

    FileSaver.saveAs(new Blob([uintArray]), fileInfo['fileName'], {
      autoBom: true,
    });
  }

}
