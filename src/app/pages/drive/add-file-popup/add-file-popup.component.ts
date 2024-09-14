import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Utils } from 'src/app/common/utils';
import { Constants } from 'src/app/Constants/constants';
import { DriveService } from 'src/app/services/drive.service';
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-add-file-popup',
  templateUrl: './add-file-popup.component.html',
  styleUrls: ['./add-file-popup.component.scss']
})
export class AddFilePopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<any>()
  @Output() saveFile = new EventEmitter<any>()
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadProgress: number | null = null;
  userDetails: any;
  isDragOver = false;
  files: File[] = [];
  currentLocation: any;
  // uploadedSize!: number;
  // totalSize!: number;

  totalFileSize: number = 0;
  uploadedSize: number = 0;
  fileProgress: any;
  saveFilesArray: any[] = []
  constructor(private utils: Utils, private driveService: DriveService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.currentLocation = localStorage.getItem('drivePath')
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.files = Array.from(event.dataTransfer.files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }
  selectFile() {
    // Trigger the hidden file input click
    this.fileInput.nativeElement.click();
  }
  updateProgress(file: File, uploadedSize: number) {
    // Accumulate the uploaded size for the specific file
  if (!this.fileProgress[file.name]) {
    this.fileProgress[file.name] = 0;
  }
  this.fileProgress[file.name] = uploadedSize;

    // Calculate the cumulative uploaded size across all files
    const cumulativeUploadedSize = Object.values(this.fileProgress).reduce((acc: number, size: any) => acc + size, 0);


    // Calculate the overall progress percentage
    this.uploadedSize = cumulativeUploadedSize
    this.uploadProgress = Math.round((cumulativeUploadedSize / this.totalFileSize) * 100);
}
  uploadFile() {
    try{
      if (this.files?.length == 0) {
        this.utils.openErrorSnackBar('Please select a file');
        return;
      }
      let fileNameContains = this.files?.some((item : any) => item.name.includes('/'))
      if(fileNameContains){
        this.utils.openErrorSnackBar("Filename should not contains '/'")
        return
      }
    
      // Maximum allowed file size in bytes (50MB)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
      // Reset progress values
      this.totalFileSize = this.files.reduce((acc, file) => acc + file.size, 0);
      if(this.totalFileSize > MAX_FILE_SIZE){
        this.utils.openErrorSnackBar('Max 50mb only allowed')
        this.totalFileSize = 0;
        this.closePopup.emit()
        return
      }
      this.uploadedSize = 0;
      this.uploadProgress = 0;
      this.fileProgress = {};
      // Array of upload promises
      const uploadPromises = this.files.map(async file => {
        let fileSizeMB = file.size / (1024 * 1024);
        let fileNameWithExtension = file.name;
        let fileName = fileNameWithExtension.split('.').slice(0, -1).join('.');
    
        if (fileSizeMB <= 5) {
          // Small file - handle single part upload
          let payload = {
            contentType: file.type,
            fileSize: file.size,
            fileName,
            filePath: this.currentLocation,
            userId: this.userDetails.user_id
          };
    
          // Return the promise chain for small file upload
          const res = await this.driveService.getSinglePresignedUrl(payload).toPromise();
          await this.uploadToS3(file, res.url, res.key, res.fileName);
    
        } else {
          // Large file - handle multipart upload
          let payload = {
            contentType: file.type,
            fileSize: file.size,
            fileName,
            filePath: this.currentLocation,
            userId: this.userDetails.user_id
          };
    
          const res_1 = await this.driveService.startMultipartUpload(payload).toPromise();
          const partNumbers = Math.ceil(fileSizeMB / 5);
          const partSize = 5 * 1024 * 1024;
          let multipartPayload = {
            fileName: res_1.fileName,
            partNumbers,
            uploadId: res_1.uploadId,
            key: res_1.key
          };
          const urls = await this.driveService.getMultipartPresignedUrls(multipartPayload).toPromise();
          return await this.multipartUploadToS3(file, res_1.uploadId, urls.presignedUrls, partSize, res_1.key, res_1.fileName);
        }
      });
    
      // Wait for all uploads to complete
      Promise.all(uploadPromises)
        .then(() => {
          this.saveFile.emit(this.saveFilesArray)
          // this.loaderService.hide();
          this.uploadProgress = null;
          this.uploadedSize = 0;
        })
        .catch(err => {
          console.error('File upload error:', err);
          this.handleUploadError();
          // this.utils.openErrorSnackBar('File uploading failed');
          // this.loaderService.hide();
          // this.uploadProgress = null;
          // this.uploadedSize = 0;
        });

    } catch (error) {
      this.handleUploadError();
      console.log(error)
    }
    
  }

  uploadToS3(file: File, url: string, key: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const loaded = event.loaded;
          this.updateProgress(file, loaded); // Update progress for the current file
        }
      };
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const payload = {
            userId: this.userDetails.user_id,
            filePath: this.currentLocation,
            fileType: file.type,
            name: fileName,
            key
          };
          // Uncomment if you want to emit payload
          this.saveFilesArray.push(payload)
          // this.saveFile.emit(payload);
          resolve(); // Resolve the promise on success
        } else {
          this.handleSingleUploadError(file, key);
          // this.handleUploadError();
          reject(new Error('Failed to upload file'));
        }
      };
  
      xhr.onerror = () => {
        this.handleUploadError();
        reject(new Error('File upload failed'));
      };
  
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }
  handleUploadError() {
    // Handle error
    console.error("File upload failed");
    this.loaderService.hide();
    this.uploadProgress = null;  // Reset progress
    this.uploadedSize = 0;  // Reset uploaded size
    this.utils.openErrorSnackBar('File uploading failed');
  }

  async multipartUploadToS3(
    file: File,
    uploadId: string,
    partUrls: string[],
    partSize: number,
    key: string,
    fileName: string
  ): Promise<void> {
    try{
      const parts: { ETag: string, PartNumber: number }[] = [];
      this.loaderService.hide();
      
      // const totalParts = partUrls.length;
      let uploadedBytes = 0;
      
      // Create upload promises for each part
      const uploadPromises = partUrls.map(async (url, index) => {
        const start = index * partSize;
        const end = Math.min(start + partSize, file.size);
        const filePart = file.slice(start, end);
    
        const etag = await this.uploadPartToS3(file,filePart, url);
        parts.push({ ETag: etag, PartNumber: index + 1 });
        // Update progress after each part is uploaded
        uploadedBytes = filePart.size;
      
      });
    
      // Wait for all parts to be uploaded
      await Promise.all(uploadPromises);
    
      // Finalize multipart upload
      return await this.completeMultipartUpload(file, fileName, key, uploadId, parts);

    } catch (error) {
      console.log(error)
      await this.abortMultipartUpload(uploadId, key);
    }
    
  }

  // Function to Upload Each Part to S3
  uploadPartToS3(file: File, filePart: Blob, url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('PUT', url, true);
       // Track the loaded size for this part
    let previousLoaded = 0;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        // Calculate the difference in loaded size from the last event
        let incrementalLoaded = event.loaded - previousLoaded;
        previousLoaded = event.loaded;
        let previousUploadedValue = this.fileProgress[file.name]
        if(previousUploadedValue){
          incrementalLoaded += previousUploadedValue
        }
        // Update the total progress with the incremental value
        this.updateProgress(file, incrementalLoaded);
      }
    };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const eTag = xhr.getResponseHeader('ETag');
          if (eTag !== null) {
            resolve(eTag);
          } else {
            reject(new Error('ETag header is missing'));
          }
        } else {
          reject(new Error('Failed to upload part'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error during part upload'));
      xhr.send(filePart);
    });
  }

  // Function to Complete Multipart Upload
  completeMultipartUpload(file: File, fileName: string, key: string, uploadId: string, parts: { ETag: string, PartNumber: number }[]): Promise<void> {
    const payload = {
      key,
      uploadId,
      parts
    };
  
    return new Promise((resolve, reject) => {
      this.driveService.completeMultipartUpload(payload).subscribe({
        next: (res) => {
          const filePayload = {
            userId: this.userDetails.user_id,
            filePath: this.currentLocation,
            fileType: file.type,
            name: fileName,
            key
          };
          this.saveFilesArray.push(filePayload)
          resolve();  // Resolve the promise on success
        },
        error: (err) => {
          this.loaderService.hide();
          reject(err);  // Reject the promise on error
        }
      });
    });
  }
  async abortMultipartUpload(uploadId: string, key: string) {
    try {
      const payload = { key, uploadId };
      await this.driveService.abortMultipartUpload(payload).toPromise();
    } catch (err) {
      console.error('Failed to abort multipart upload:', err);
    }
  }
  async handleSingleUploadError(file: File, key: string) {
    try {
      await this.driveService.deleteSingleFile({ key }).toPromise(); // Cleanup file if upload fails
    } catch (err) {
      console.error('Failed to delete incomplete file:', err);
    }
  }
}
