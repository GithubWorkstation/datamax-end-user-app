import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from 'src/app/pages/upload/upload.component';
import { DownloadComponent } from '../../pages/download/download.component';
import { MyFilesComponent } from '../../pages/my-files/my-files.component';
import { FilesizerPipe } from 'src/app/filesizer.pipe';
import { CreateFolderComponent } from '../../pages/create-folder/create-folder.component';
import { SharedWithMeComponent } from '../../pages/shared-with-me/shared-with-me.component';


@NgModule({
  declarations: [
    UploadComponent,
    DownloadComponent,
    MyFilesComponent,
    FilesizerPipe,
    CreateFolderComponent,
    SharedWithMeComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FilesizerPipe]
})
export class AdminLayoutModule { }
