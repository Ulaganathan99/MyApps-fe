import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {
  @Input() listLength: any
  @Input() page_records_count: any
  @Input() recordsCount: any
  @Input() searchLength: any;
  @Output() pageEventData = new EventEmitter<any>();
  current_page = 1;
  last_page: any
  start_page_count = 1;

  end_page_count: any;

  constructor() { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchLength'] && !changes?.['searchLength'].firstChange) {
      this.first();
    }
    if(changes['listLength']) this.listLength = changes['listLength'].currentValue;
    if(changes['page_records_count']) this.page_records_count = changes['page_records_count'].currentValue;
  }

  ngOnInit(): void {
    this.end_page_count = this.recordsCount;
    this.last_page = Math.ceil(this.listLength / this.page_records_count);
    
  }

  first() {
    this.current_page = 1;
    this.start_page_count = 1;
    this.end_page_count = this.recordsCount;
    this.last_page = Math.ceil(this.listLength / this.page_records_count);
  }


  previous() {
    if (this.current_page != 1) {
      this.current_page--;

      this.start_page_count -= this.page_records_count;
      this.end_page_count -= this.page_records_count;

      this.pageEventData.emit({ pageIndex: this.current_page, pageSize: this.page_records_count });
    }

  }

  next() {
    if (this.current_page != this.last_page) {
      this.current_page++;
      this.start_page_count += this.page_records_count;
      this.end_page_count += this.page_records_count;

      this.pageEventData.emit({ pageIndex: this.current_page, pageSize: this.page_records_count });
    }
  }
}
