import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries';
import { map, Observable, catchError, throwError, delay } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]>{
    query = query.toLowerCase();

    //aquí en el servico debo realizar todos los mapper de manera centralizada
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${ query }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      catchError(error => {
        //console.log('Error fetching', error);

        return throwError(()=> new Error(`No country was found with the capital ${query}`))
      })
      );    
  }

  searchByCountry(query: string): Observable<Country[]>{
    query.toLocaleLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${ query }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      //delay(3000),
      catchError(error => {
        console.log('Error fetching', error);

        return throwError(()=> new Error(`No country was found with the country ${query}`))
      })
      ); 
  }

  searchCountryByAlfaCode(code: string) {
    
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${ code }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      map(countries => countries.at(0)),

      catchError(error => {
        console.log('Error fetching', error);

        return throwError(()=> new Error(`No country was found with the code ${code}`))
      })
      ); 
  }
}