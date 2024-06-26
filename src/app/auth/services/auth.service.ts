import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario; 

  //desestructurar para evitar que accidentalmente manipule el usuario
  get usuario() { 
    return {...this._usuario}
  }


  constructor(private http: HttpClient) { }

  registro(name: string, email: string, password: string) { 
    
  const url = `${this.baseUrl}/auth/new`;
  const body = { email, password, name };
  // Se realiza una solicitud HTTP POST usando la biblioteca 'http'.
  // La respuesta se espera que sea de tipo 'AuthResponse'.
  return this.http.post<AuthResponse>(url, body)
    .pipe(  
      tap(resp => { // Se utiliza el operador 'tap' para realizar acciones secundarias cuando la solicitud tiene éxito.
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);// Si la respuesta es exitosa (ok), se almacena el token en el almacenamiento local.
        }
      }),
      map(resp => resp.ok),// Se utiliza el operador 'map' para transformar la respuesta en un booleano (true si es 'ok', false en caso contrario).
      catchError(err => of(err.error.msg)) // Se utiliza el operador 'catchError' para manejar cualquier error que pueda ocurrir durante la solicitud.
    );
}

  login(email: string, password: string) { 

    const url = `${this.baseUrl}/auth`;
    const body = { email, password };
  
    //el operador map me permite mutar la resp y lo uqe sea que yo retorn... ver video010
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => { 
          if (resp.ok) {
              localStorage.setItem('token', resp.token!);
            }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg))
    
    )
  }

  validarToken(): Observable<boolean>{ 
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');
  
    return this.http.get<AuthResponse>( url, { headers } )
      .pipe(
        map(resp => { 
            localStorage.setItem('token', resp.token!);
              this._usuario = {
                name: resp.name!,
                uid: resp.uid!,
                email:resp.email!
              }
          return resp.ok;
        }),
        catchError(err => of(false))
        )
  }

  logout() { 
    localStorage.clear();
  }

}
