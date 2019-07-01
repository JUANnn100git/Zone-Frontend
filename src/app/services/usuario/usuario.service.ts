import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Permiso } from '../../models/permiso.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage(id: string, name: string, token: string, claims: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    this.usuario = new Usuario(id, name, ':)', JSON.stringify(claims));
    localStorage.setItem('usuario', JSON.stringify(this.usuario));

    this.token = token;
  }

  logout() {

    this.usuario = null;
    this.token = '';


    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem('username', usuario.name);
    } else {
      localStorage.removeItem('username');
    }

    const url = URL_SERVICIOS + '/api/users/login';

    return this.http.post( url, usuario )
              .pipe(
                map( (resp: any) => {
                  this.guardarStorage(resp.id, resp.name, resp.bearerToken, resp.claims);
                  return true;
                })
              );

  }

  cargarUsuarios( desde: number = 0, mostrar: number = 10 ) {

    const url = URL_SERVICIOS + '/api/users/all?pageSize=' + mostrar + '&page=' + desde;

    const headers = new HttpHeaders(
      {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

    return this.http.get( url, { headers } );

  }

  obtenerUsuario( id: string ) {

    const url = URL_SERVICIOS + '/api/users/' + id;

    const headers = new HttpHeaders(
      {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

    return this.http.get( url, { headers } );


  }

  crearUsuario( name: string, password: string ) {

    const url = URL_SERVICIOS + '/api/users';

    const usuario = new Usuario(null, name, password, null);

    const headers = new HttpHeaders(
      {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

    return this.http.post( url, usuario, { headers } );

  }

  agregarPermisoUsuario( userid: string, claim: string ) {

    const url = URL_SERVICIOS + '/api/users/claims/' + userid;

    const usuario = new Usuario(userid, null, null, null);
    const permiso = new Permiso(null, claim, 'true', usuario);

    const headers = new HttpHeaders(
      {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

    return this.http.post( url, permiso, { headers } );

  }

}
