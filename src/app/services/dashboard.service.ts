// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Visitor } from '../model/visitor';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/consumer';

  constructor(private http: HttpClient) {}

  getVisitors(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createVisitor(visitor: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(this.apiUrl, visitor).pipe(
      catchError(this.handleError)
    );
  }

  updateVisitor(visitId: number, status: string): Observable<Visitor> {
    const url = `${this.apiUrl}?visitId=${visitId}&status=${encodeURIComponent(status)}`;
    return this.http.put<Visitor>(url, null).pipe(
      catchError(this.handleError)
    );
  }

  deleteVisitor(id: number): Observable<void> {
    const url = `${this.apiUrl}/delete?visitId=${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Server Error:', error);
    let errorMessage = 'Something went wrong! Please try again.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
