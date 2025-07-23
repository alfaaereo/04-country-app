import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { Observable } from 'rxjs';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-page',
  imports: [],
  templateUrl: './country-page.component.html'  
})
export class CountryPageComponent {

  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryService = inject(CountryService);

  // countryResources = rxResource({
  //   params: () => ({ code: this.countryCode }),
  //   loader: ({ params }) =>  {

  //     return this.countryService.searchCountryByAlfaCode(params.code)
  //   },    
  // });

 }
