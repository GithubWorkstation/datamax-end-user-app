import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-shared-with-me',
  templateUrl: './shared-with-me.component.html',
  styleUrls: ['./shared-with-me.component.css']
})
export class SharedWithMeComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  fileList: any[] = [];
  isSubFolder: boolean = false;
  folderName: string;

  constructor(
    private fb: FormBuilder,
    public db: DbService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(({fileName = ""}: { fileName: string }) => {
      this.folderName = fileName;
      this.isSubFolder = fileName.length !== 0;
      this.getAllFiles(fileName);
    })
  }

  ngOnInit(): void {}

  getFileDir(fileName) {
    let sub: Subscription;
    return new Promise<any>((resolve, reject) => {
      sub = this.db.sharedFilesSub.subscribe((value) => {
        if(value.length !== 0) {
          let dirPath = value.find(x => x.file.fileName === fileName)
          resolve(dirPath);
        }
      })
    }).finally(() => sub.unsubscribe());
  }

  async getAllFiles(fileName) {
    if(this.isSubFolder) {
      let dirPath = await this.getFileDir(fileName);    
      this.httpClient.get(`${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/getAllFiles?rootFolderName=${dirPath?.filePath}&isSubFolder=${this.isSubFolder}`)
        .subscribe({
          next: (value: any[]) => {
            this.fileList = value.map(e => ({ file: { ...e } }))
          }
        })
    } else {
      this.db.sharedFilesSub.subscribe((value) => {
        if(value.length !== 0) {
          this.fileList = [...value] 
        }
      })
    }
  }

  viewDirFiles(fileName) {
    this.router.navigate([], {
      queryParams: {
        fileName: fileName
      }, 
      queryParamsHandling: 'merge',
      relativeTo: this.route
    })
  }

}
