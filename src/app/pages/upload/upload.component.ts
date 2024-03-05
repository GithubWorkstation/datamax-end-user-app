import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/services/db.service'
import { BaseUrls } from 'src/app/base-urls';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user') ?? '{}')

  fileUrls: any = null;
  selectedFiles?: FileList;

  directoriesList: any[] = [];
  selectedDirectories: FormControl = new FormControl("");


  constructor(
    public db: DbService,
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.db.directorySub.subscribe((value) => {
      if(value.length !== 0) {
        this.directoriesList = value;
      }
    })
    
  }

  onFileSelection(event) {  // this function was used to add the image files to the mediaUrl array created above.
    let files = event.target.files;
    this.fileUrls = files[0];
  }

  getImageResource(media: {file: any; fileUrl: string}) {
    let url;
    let reader = new FileReader()
    reader.onload = (event) => {
      url = event.target.result;
    }
    reader.readAsDataURL(media.file);
    return url;
  }
  
  removeMediaObj(index: number) {
    let obj = this.fileUrls.splice(index, 1)[0]
  }

  onListItemClicked(value) {
    this.selectedDirectories.setValue(value);
  }

  openModal(modalRef: TemplateRef<unknown>) {
    this.modalService.open(modalRef);
  }

  uploadFile() {
    let formData = new FormData();
    let bool = this.selectedDirectories.value.length === 0
    formData.append("isUploadDirectory", String(!bool))
    formData.append("rootFolderName", !bool ? this.selectedDirectories.value : this.user['email']);
    formData.append("secretKey", this.user['secretKey']);
    formData.append("file", this.fileUrls, this.fileUrls.name);

    formData.forEach((value, key) => {
      console.log(key, value);
      
    })
    this.httpClient.post(`${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/upload`, formData)
      .subscribe({
        next: (value) => {
          this.fileUrls = null
          this.modalService.dismissAll();
          alert("File uploaded successfully")
        }, 
        error: (error) => {
          console.log(error);
        }
      })
  }

}
