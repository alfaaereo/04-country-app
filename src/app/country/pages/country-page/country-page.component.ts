import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from "../../components/not-found/not-found.component";
import { CountryInformationComponent } from './country-information/country-information.component';


@Component({
  selector: 'app-country-page',
  imports: [NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html'  
})
export class CountryPageComponent {

  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryService = inject(CountryService);

  countryResources = rxResource({
    params: () => ({ code: this.countryCode }),
    stream: ({ params }) =>  {

      return this.countryService.searchCountryByAlfaCode(params.code)
    },    
  });

 }
