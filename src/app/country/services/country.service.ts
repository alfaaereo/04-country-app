import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);
  //Manejo de caché
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();

  searchByCapital(query: string): Observable<Country[]>{
    query = query.toLowerCase();

    if(this.queryCacheCapital.has(query)){
      return of(this.queryCacheCapital.get(query) ?? []);
    }
    
    console.log(`Arriving to server by  ${ query}`);

    //aquí en el servico debo realizar todos los mapper de manera centralizada
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${ query }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap(countries => this.queryCacheCapital.set(query, countries)), //manejo del caché
      catchError(error => {
        //console.log('Error fetching', error);

        return throwError(()=> new Error(`No country was found with the capital ${query}`))
      })
      );    
  }

  searchByCountry(query: string): Observable<Country[]>{
    query.toLocaleLowerCase();

    if(this.queryCacheCountry.has(query)){
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    console.log(`Arriving to server by  ${ query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${ query }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap(countries => this.queryCacheCountry.set(query, countries)),
      //delay(3000),
      catchError(error => {
        
        return throwError(()=> new Error(`No country was found with the country ${query}`))
      })
      ); 
  }

  searchByRegion(region: Region): Observable<Country[]>{
    
    if(this.queryCacheRegion.has(region)){
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    console.log(`Arriving to server by  ${ region}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${ region }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap(countries => this.queryCacheRegion.set(region, countries)),
      
      catchError(error => {
        console.log('Error fetching', error);

        return throwError(()=> new Error(`No country was found with the country ${region}`))
      })
      ); 
  }

  searchCountryByAlfaCode(code: string) {
    
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${ code }`)
    .pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      map(countries => countries.at(0)),//regreso el primero

      catchError(error => {
        
        return throwError(()=> new Error(`No country was found with the code ${code}`))
      })
      ); 
  }
}