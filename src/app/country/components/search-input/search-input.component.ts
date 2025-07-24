import {Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  placeholder = input('Search');
  value = output<string>();
  debounceTime = input(300);//se puede enviar desde la página o establecer por defecto
  initialValue = input<string>();

  inputValue = linkedSignal<string>(()=> this.initialValue() ?? '');

  debounceEffect = effect((onCleanUp)=> {
    const value = this.inputValue();

    const timeout = setTimeout(()=> {
      this.value.emit(value);      
    }, this.debounceTime());

    onCleanUp(()=> {
      clearTimeout(timeout);
    })
  })
 }
