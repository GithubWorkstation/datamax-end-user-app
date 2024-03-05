import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UploadComponent } from 'src/app/pages/upload/upload.component';
import { DownloadComponent } from 'src/app/pages/download/download.component';
import { MyFilesComponent } from 'src/app/pages/my-files/my-files.component';
import { CreateFolderComponent } from 'src/app/pages/create-folder/create-folder.component';
import { SharedWithMeComponent } from 'src/app/pages/shared-with-me/shared-with-me.component';

const routes: Routes = [
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'download', component: DownloadComponent, canActivate: [AuthGuard] },
  { path: 'create-folder', component: CreateFolderComponent, canActivate: [AuthGuard] },
  { path: 'files', component: MyFilesComponent, canActivate: [AuthGuard]},
  { path: 'shared-with-me', component: SharedWithMeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
