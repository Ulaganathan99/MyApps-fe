import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  folderList: any[] = [{
    userId: '6158R2Z2',
    filePath: 'Home',
    fileType: 'folder',
    name: 'first',
    edit: false
  },
  {
    userId: '6158R2Z2',
    filePath: 'Home',
    fileType: 'folder',
    name: 'second',
    edit: false

  }]
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

  addFolder(){
    this.folderList.unshift({
        userId: this.userDetails.user_id,
        filePath: this.currentLocation,
        fileType: 'folder',
        name: 'folder name',
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
    this.folderList[index].edit = false;
    this.saveFolderName(this.folderList[index]);
  }
  selectText(inputElement: HTMLInputElement) {
    inputElement.select();
  }

  saveFolderName(folder: any) {
    this.loaderService.show()
    this.driveService.uploadFile(folder).subscribe({
      next: (res) => {
        if(res.statusCode == 0){
          this.utils.openErrorSnackBar('Folder already exist')
          this.fetchFiles()
        }
        if(res.statusCode == 1){
          if(res.folderData){
            this.folderList = res.folderData
            this.utils.openSuccessSnackBar('Folder Created')
          }
        }
        this.loaderService.hide()
      },
      error: (err) => {
        console.log(err)
        this.loaderService.hide()
      }
    })
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
          this.fileList = res.fileData
        }
        this.loaderService.hide()
      }, 
      error: (err) => {
        console.log(err)
        this.loaderService.hide()
      }
    })
  }
  onDoubleClick(data: any){
    this.folderName = data.name
    this.currentLocation = this.currentLocation + `/${data.name}`
    this.fetchFiles()
  }
  clickBack(){
    const locationArray = this.currentLocation.split('/');
    let lastFolder = locationArray.pop();
    if(lastFolder){
      this.folderName = locationArray[locationArray.length-1]
    }
    this.currentLocation = locationArray.join('/');
    this.fetchFiles()
  }
  ngOnDestroy(){
    localStorage.removeItem('drivePath')
  }

}
