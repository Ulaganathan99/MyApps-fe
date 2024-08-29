import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-file-popup',
  templateUrl: './add-file-popup.component.html',
  styleUrls: ['./add-file-popup.component.scss']
})
export class AddFilePopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<any>()
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  isDragOver = false;
  files: File[] = [];

  constructor() { }

  ngOnInit(): void {
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

}
