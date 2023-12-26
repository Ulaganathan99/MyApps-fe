import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() option_list!: any;
  @Output() option_changed = new EventEmitter<any>();
  
  selected_option: any = null;
  options: boolean = false;


  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.selected_option = this.option_list[0] || null;
  }

  showOptions(){
    this.options = !this.options;
  }
  selectOption(data: any) {
    this.selected_option = data;
    
    this.options = false;
    this.option_changed.emit(data);
  }
  getOptionBackgroundColor(option: any): boolean {
    return this.selected_option === option ? true : false;
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const isClickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!isClickedInside) {
      this.options = false;
    }
  }

}
