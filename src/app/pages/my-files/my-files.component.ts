import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.css'],
})
export class MyFilesComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  fileList: any[] = [];
  isSubFolder: boolean = false;
  folderName: string;

  shareWithUserFormGroup: FormGroup;
  directoriesList: any[] = [];
  selectedDirectories: FormControl = new FormControl("");
  // email, filePath, secretKey, userEmailAddress, userid
  isMoveOperation: boolean = false;
  filePath: string;

  constructor(
    private fb: FormBuilder,
    public db: DbService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {

    this.route.queryParams.subscribe(({fileName = ""}: { fileName: string }) => {
      this.folderName = fileName;
      this.isSubFolder = fileName.length !== 0;
      this.getAllFiles(fileName);
    })
  }

  ngOnInit(): void {
    this.db.directorySub.subscribe((value) => {
      if(value.length !== 0) {
        this.directoriesList = value;
      }
    })
  }

  getFileDir(fileName) {
    let sub: Subscription;
    return new Promise<any>((resolve, reject) => {
      sub = this.db.filesSub.subscribe((value) => {
        if(value.length !== 0) {
          let dirPath = value.find(x => x.fileName === fileName)
          resolve(dirPath);
        }
      })
    }).finally(() => sub.unsubscribe());
  }

  async getAllFiles(fileName) {
    if(this.isSubFolder) {
      let dirPath = await this.getFileDir(fileName);
      this.httpClient.get(`${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/getAllFiles?rootFolderName=${dirPath.filePath}&isSubFolder=${this.isSubFolder}`)
        .subscribe({
          next: (value: any[]) => {
            this.fileList = [...value]
          }
        })
    } else {
      this.db.filesSub.subscribe((value) => {
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

  deleteFile(filepath, idx){
    this.httpClient
      .get(
        `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/delete-file?filePath=${filepath}`
      )
      .subscribe({
        next: (value: any) => {
          // console.log(value);
          this.fileList.splice(idx, 1);
          alert("File Deleted Successfully")
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  initializeModal(modalRef: TemplateRef<unknown>, filePath: string) {
    this.shareWithUserFormGroup = this.fb.group({
      filePath: [filePath],
      sharedToUserEmail: [""],
      sharedToUserId: [0],
      sharedBySecretKey: [this.user.secretKey],
      sharedByUserId: [this.user.userId]
    });
    this.modalService.open(modalRef);
  }

  shareFileWithUser() {
    let values = { ...this.shareWithUserFormGroup.value };
    
    let formData = new FormData();
    Object.entries(values).forEach(([key, value]: [string, any]) => formData.append(key, value))

    this.httpClient.post(
      `${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/share-file`,
      formData
    )
    .subscribe({
      next: (value) => {
        console.log(value);
        this.modalService.dismissAll();
        this.toast.success("File Shared Successfully");
      },
      error: (error) => {
        console.log(error);
        this.toast.error("Unable to Share File")
      }
    })
  }

  openModal(modalRef: TemplateRef<unknown>, isMoveOperation: boolean, filePath: string) {
    this.selectedDirectories.setValue("");
    this.isMoveOperation = isMoveOperation;
    this.filePath = filePath;
    this.modalService.open(modalRef);
  }

  onListItemClicked(value) {
    this.selectedDirectories.setValue(value);
  }

  saveOperation(isRootFolder: boolean = false) {
    if(!isRootFolder && this.selectedDirectories.value.length === 0) {
      this.toast.info("Please Select Directory");
      return;
    }

    let newPath;
    let fileName = this.fileList.find(x => x.filePath === this.filePath).fileName;
    if(this.isSubFolder) {
      if(isRootFolder) {
        // Copy or Move file to root folder
        newPath = this.filePath.replace(this.folderName + "/", "")
      } else {
        // Copy or Move file to another folder
        let dirName = this.directoriesList.find(x => x.filePath === this.selectedDirectories.value).fileName
        newPath = this.filePath.replace(this.folderName, dirName)
      }
    } else {
      let dir = this.selectedDirectories.value;
      newPath = `${dir}/${fileName}`
    }

    let uri = this.isMoveOperation ? 'move-file' : 'copy-file';
    let formData = new FormData();
    formData.append("oldPath", this.filePath)
    formData.append("newPath", newPath);

    this.httpClient.post(`${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/${uri}`, formData)
      .subscribe({
        next: (value) => {
          this.modalService.dismissAll();
          this.toast.success(`File is ${this.isMoveOperation ? 'moved' : 'copied'} successfully to ${this.selectedDirectories.value}`);
        },
        error: (error) => {
          console.log(error);
          
          this.toast.error("Something went wrong!! Please try again")
        }
      })
  }
}
