import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Utils } from 'src/app/common/utils';
import { Constants } from 'src/app/Constants/constants';
import { DriveService } from 'src/app/services/drive.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-drive-summary',
  templateUrl: './drive-summary.component.html',
  styleUrls: ['./drive-summary.component.scss']
})
export class DriveSummaryComponent implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;
  
  searchText: any;
  showAddFile: boolean = false;
  folderName: string = 'Home'
  currentLocation: string = 'Home';
  userDetails: any;
  folderList: any[] = []
  nameEdit: boolean = false;
  fileList: any [] = [
    {
      userId: '6158R2Z2',
      filePath: 'Home',
      fileType: 'folder',
      name: 'first file',
      edit: false
    },
    {
      userId: '6158R2Z2',
      filePath: 'Home',
      fileType: 'folder',
      name: 'second file',
      edit: false
    }
  ]

  constructor(private searchService: SearchService, private driveService: DriveService, private loaderService: LoaderService, private utils: Utils) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    localStorage.setItem('drivePath', 'Home')
    this.fetchFiles()
  }
  onSearch(event: any) {
    this.searchText = event.searchText;
    this.searchService.setSearchText(event.searchText);
  }

  addFolder(name: string){
    this.folderList.unshift({
        userId: this.userDetails.user_id,
        filePath: this.currentLocation,
        fileType: 'folder',
        name: name,
        edit: true
    })
    // Focus and select text in the input field after the new folder is rendered
    setTimeout(() => {
      if (this.inputField) {
        this.inputField.nativeElement.focus();
        this.selectText(this.inputField.nativeElement);
      }
    }, 0); // Timeout to allow Angular to render the input element
  }
  onBlur(index: number) {
    if(this.folderList[index].name.includes('/')){
      this.utils.openErrorSnackBar("Foldername should not contains '/'")
          setTimeout(() => {
            if (this.inputField) {
              this.inputField.nativeElement.focus();
              this.selectText(this.inputField.nativeElement);
            }
          }, 0);
      return
    }
    this.folderList[index].edit = false;
    this.saveFolderName(this.folderList[index]);
  }
  selectText(inputElement: HTMLInputElement) {
    inputElement.select();
    this.nameEdit = true
  }

  saveFolderName(data: any) {
    if(data.fileType == 'folder' && data.name.trim() == ''){
      this.folderList?.shift()
      return
    }
    this.loaderService.show()
    this.driveService.uploadFile(data).subscribe({
      next: (res) => {
        if(res.statusCode == 0){
          this.utils.openErrorSnackBar('Folder already exist')
          this.folderList.shift()
          this.addFolder(data.name)
          setTimeout(() => {
            if (this.inputField) {
              this.inputField.nativeElement.focus();
              this.selectText(this.inputField.nativeElement);
            }
          }, 0);
          this.nameEdit = true
        }
        if(res.statusCode == 1){
          if(res.folderData){
            this.folderList = res.folderData
            this.utils.openSuccessSnackBar('Folder Created Successfully')
          }
          this.nameEdit = false
          this.fetchFiles()
        }
        this.loaderService.hide()
      },
      error: (err) => {
        console.log(err)
        this.loaderService.hide()
      }
    })
  }

  saveFileNames(data: any[]) {
    this.showAddFile = false;
    this.loaderService.show();
  
    const uploadObservables = data.map((item: any) => this.driveService.uploadFile(item));
  
    // Use forkJoin to wait for all uploads to complete
    forkJoin(uploadObservables).subscribe({
      next: (responses) => {
        let allSuccess = true;
  
        responses.forEach((res: any) => {
          if (res.statusCode === 2 && res.fileData) {
            this.fileList = res.fileData;
          } else {
            allSuccess = false;
          }
        });
  
        if (allSuccess) {
          this.utils.openSuccessSnackBar('File added Successfully');
          this.fetchFiles();  // Fetch updated data after all uploads
        }else{
          this.loaderService.hide();
        }
  
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      }
    });
  }

  fetchFiles(){
    let payload = {
      filePath : this.currentLocation,
      userId : this.userDetails.user_id
    }
    this.loaderService.show()
    this.driveService.fetchFile(payload).subscribe({
      next: (res) => {
        if(res.statusCode == 1){
          this.folderList = res.folderData
           // Process fileList
          this.fileList = res.fileData.map((file: any) => ({
            ...file,
            edit: false, // For rename the file
            downloadProgress: 0, // Initialize download progress
            isDownloading: false // Initialize download state
          }));
        }
        this.loaderService.hide()
      }, 
      error: (err) => {
        console.log(err)
        this.loaderService.hide()
      }
    })
  }
  clickFolder(data: any){
    if(this.nameEdit) return
    this.folderName = data.name
    this.currentLocation = this.currentLocation + `/${data.name}`
    localStorage.setItem('drivePath', this.currentLocation)
    this.fetchFiles()
  }
  clickBack(){
    const locationArray = this.currentLocation.split('/');
    let lastFolder = locationArray.pop();
    if(lastFolder){
      this.folderName = locationArray[locationArray.length-1]
    }
    this.currentLocation = locationArray.join('/');
    localStorage.setItem('drivePath', this.currentLocation)
    this.fetchFiles()
  }
  deleteFile(item: any){
    this.loaderService.show()
    let payload = {
      key : item.key,
      objectId: item._id,
      userId: this.userDetails.user_id
    }
    this.driveService.deleteSingleFile(payload).subscribe({
      next: (res) => {
        if(res.statusCode == 1){
          
          this.fetchFiles()
        }else{
          this.loaderService.hide()
        }
      },
      error: (err) => {
        console.log(err)
        this.loaderService.hide()
      }
    })
  }
  clickOnFile(file: File){

  }
  downloadFile(item: any) {
    const xhr = new XMLHttpRequest();
    
    // Set up the request
    xhr.open('GET', item.s3Url, true);
    xhr.responseType = 'blob';
    
    // Mark the file as downloading
    item.isDownloading = true;
    item.downloadProgress = 0;
  
    // Progress event to track download progress
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        item.downloadProgress = percentage;
        this.updateProgress(item.downloadProgress)
      }
    };
  
    // Load event to handle the completion of the download
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.name || 'downloaded_file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the element
        window.URL.revokeObjectURL(url); // Release the object URL
      }
  
      // Reset download state
      item.isDownloading = false;
      item.downloadProgress = 0;
    };
  
    // Error event handling
    xhr.onerror = () => {
      this.utils.openErrorSnackBar('Download Error...')
      item.isDownloading = false;
    };
  
    // Start the download
    xhr.send();
  }
  updateProgress(progress: number) {
    const circle = document.querySelector('.progress-ring__circle') as SVGCircleElement;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
  
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
  }
  renameFile(data: any){
    let payload = {
      userId: this.userDetails.user_id,
      filePath: this.currentLocation,
      oldKey: data.key,
      newFileName: data.name,
      objectId: data._id
    }
    this.loaderService.show()
    this.driveService.renameFile(payload).subscribe({
      next:(res) => {
        if(res.statusCode == 1){
          this.fetchFiles()
          this.utils.openSuccessSnackBar('File name change successfully')

        }else{
          this.loaderService.hide()
        }
      },
      error: (err) => {
        this.loaderService.hide()
        console.log(err)
      }
    })
  }
  clickRename(item: any){
    item.edit = true
    setTimeout(() => {
      if (this.inputField) {
        this.inputField.nativeElement.focus();
        this.selectText(this.inputField.nativeElement);
      }
    }, 0);
    
  }
  onFileBlur(index: number){
    if(this.fileList[index].name.includes('/')){
      this.utils.openErrorSnackBar("Filename should not contains '/'")
          setTimeout(() => {
            if (this.inputField) {
              this.inputField.nativeElement.focus();
              this.selectText(this.inputField.nativeElement);
            }
          }, 0);
      return
    }
    this.fileList[index].edit = false;
    this.renameFile(this.fileList[index])

  }
  ngOnDestroy(){
    localStorage.removeItem('drivePath')
  }

}
