import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { ConfigurationItem } from '../model/configuration-item';

@Injectable()
export class ConfigurationItemService {

  private configurationItemsUrl = 'http://localhost:5050/configuration/';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  getConfigurationItems(): Promise<ConfigurationItem[]> {
      return this.http.get(this.configurationItemsUrl)
        .toPromise()
        .then(response => response.json() as ConfigurationItem[])
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('DAMN, An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
