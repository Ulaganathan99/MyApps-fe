import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider-input',
  templateUrl: './slider-input.component.html',
  styleUrls: ['./slider-input.component.scss']
})
export class SliderInputComponent implements OnInit {
  @Input() selectedValue: number =50;
  @Input() step: number | undefined;
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  @Input() type: string | undefined;
  @Output() valueChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    const progressBar = document.querySelector('.custom-slider') as HTMLElement;
    progressBar.style.setProperty('--value', this.selectedValue.toString());
  }
  onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedValue = Number(target.value);
    const progressBar = document.querySelector('.custom-slider') as HTMLElement;
    progressBar.style.setProperty('--value', this.selectedValue.toString());
    this.valueChange.emit(this.selectedValue);
  }

}
