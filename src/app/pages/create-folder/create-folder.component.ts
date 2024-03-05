import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("user") ?? "{}")
  folderNameControl: FormControl = new FormControl();

  constructor(
    public db: DbService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }

  createNewFolderRequest() {
    // Two Arguement requried in the http request -> send as query parameters | For Reference check my-files component ts file
    // Request Method => GET
    this.httpClient
      .get(
        `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/create-new-folder?rootFolderName=${this.user['email']}&folderName=${this.folderNameControl.value.trim()}`
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.folderNameControl.reset()
          alert("Created Successfully")
        },
        error: (err) => {
          console.log(err);
          
        },
      })
  }
}
