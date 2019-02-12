import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import { ConfigurationItem } from '../model/configuration-item';

@Injectable()
export class ConfigurationItemService {

  private configurationItemsUrl = '/api/configuration/';

  constructor(private http: HttpClient) {}

  getConfigurationItems(): Observable<ConfigurationItem[]> {
      return this.http.get<ConfigurationItem[]>(this.configurationItemsUrl)
        .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
  }
}
