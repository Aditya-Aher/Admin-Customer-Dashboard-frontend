import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Visitor } from '../model/visitor';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private apiUrl = 'http://localhost:8080/api/consumer';

  constructor(private http: HttpClient) {}

  // ✅ Get all visitors
  getVisitors(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

 

  // ✅ Create a new visitor
  createVisitor(visitor: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(this.apiUrl, visitor).pipe(
      catchError(this.handleError)
    );
  }


  // ✅ Error handler
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
