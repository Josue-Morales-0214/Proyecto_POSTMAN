import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiRequest, ApiResponse } from './app.model'; // <--- Apuntando a tu archivo

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  sendRequest(request: ApiRequest): Observable<ApiResponse> {
    const startTime = performance.now();
    
    let headers = new HttpHeaders();
    request.headers.forEach(h => {
      if(h.key && h.value) headers = headers.append(h.key, h.value);
    });

    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
      try {
        body = JSON.parse(request.body);
      } catch (e) {
        console.error('Invalid JSON body');
        body = {};
      }
    }

    return this.http.request(request.method, request.url, {
      body,
      headers,
      observe: 'response'
    }).pipe(
      map((res: HttpResponse<any>) => {
        const endTime = performance.now();
        return {
          status: res.status,
          statusText: res.statusText,
          time: Math.round(endTime - startTime),
          data: res.body,
          size: JSON.stringify(res.body).length + ' bytes'
        };
      }),
      catchError((err) => {
        const endTime = performance.now();
        return of({
          status: err.status || 0,
          statusText: err.statusText || 'Error',
          time: Math.round(endTime - startTime),
          data: err.error || { error: 'Error de conexión' },
          size: '0 bytes'
        });
      })
    );
  }
}