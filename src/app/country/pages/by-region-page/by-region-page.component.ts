import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { Region } from '../../interfaces/region';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

  function validateQueryParam(queryParam: string): Region{
    queryParam.toLowerCase();

    const validRegions: Record<string, Region> = {
     africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europa: 'Europe',
    oceania: 'Oceania',
    antartic: 'Antarctic'
    };

    return validRegions[queryParam] ?? 'Americas';
  }



@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html'
})
export class ByRegionPageComponent { 
    
  countryService = inject(CountryService);

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router); //para cambiar el query
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';


  selectedRegion = linkedSignal<Region>(()=> 
    validateQueryParam(this.queryParam ?? 'Americas')
  );
  
  countryResource = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if(!params.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: params.region,
        }
      });

      return this.countryService.searchByRegion(params.region);
    }
  })

}
