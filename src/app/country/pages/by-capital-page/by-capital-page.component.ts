import { Component, inject, signal, resource } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';



@Component({
  selector: 'country-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html'  
})
export class ByCapitalPageComponent { 
  countryService = inject(CountryService);
  query = signal('');

  //Opción más óptima con rxResouce (Observable)  
  // countryResource = rxResource({
  //     params: () => ({ query: this.query() }),
  //     loader: ({ params }) => {
  
  //       if(!params.query) return of([]);
  
  //       return this.countryService.searchByCapital(params.query);
  //     },
  //   });

  
  //Opción 2, con resource (promesas)
  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async({ params }) => {

      if(!params.query) return [];

      return await firstValueFrom(this.countryService.searchByCapital(params.query));
    },
  });

  //Opción 1: Esto fue reemplazado por lo que está en resource (promesas)
  // isLoading = signal(false);
  // isError = signal<String|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string){
  //   if(this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query)
  //   .subscribe({
  //     next: (countries)=> {
  //      this.isLoading.set(false);
  //      this.countries.set(countries);      
  //   },
  //   error: (err) =>{
  //     this.isLoading.set(false);
  //     this.countries.set([]);
  //     this.isError.set(err)
  //   }     
  //   });
  //}
}