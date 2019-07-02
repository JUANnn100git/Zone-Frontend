import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuario: Usuario = null;
  usuarios: Usuario[] = [];
  desde: number = 0;
  mostrar: number = 10;

  totalRegistros: number = 0;
  cargando: boolean = true;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor( public _usuarioService: UsuarioService,
               @Inject(DOCUMENT) private document: Document ) { }

  ngOnInit() {

    this.inicializarDropDownList();
    this.cargarUsuarios();

  }

  inicializarDropDownList() {
    this.dropdownList = [
      {id: 1, itemName: 'canAccessAccounts'},
      {id: 2, itemName: 'canSaveAccount'},
      {id: 3, itemName: 'canAddAccount'},
      {id: 4, itemName: 'canAccessCustomers'},
      {id: 5, itemName: 'canSaveCustomer'},
      {id: 6, itemName: 'canAddCustomer'}
    ];
    this.selectedItems = [ ];
    this.dropdownSettings = {
          singleSelection: false,
          text: 'Seleccionar Permisos',
          selectAllText: 'Seleccionar Todos',
          unSelectAllText: 'Quitar Todos',
          enableSearchFilter: true,
          classes: 'myclass custom-class'
    };
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde, this.mostrar )
              .subscribe( (resp: any) => {
                console.log('resp', resp);
                this.totalRegistros = resp.total;
                this.usuarios = resp.users;
                this.cargando = false;
              });

  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    console.log(desde);
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }


  async alertCrearUsuario() {

    const {value: formValues} = await Swal.fire({
      title: 'Registro de Usuario',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre de Usuario">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Contraseña">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ];
      }
    });


    if (formValues) {

      if (formValues[0] === '' || formValues[1] === '') {
        console.log('Campos vacíos');
        Swal.fire({
          type: 'error',
          title: 'Upsss...',
          text: 'Los campos son obligatorios'
        });
        return;
      }

      this._usuarioService.crearUsuario(formValues[0], formValues[1])
      .subscribe( resp => {
                    console.log(resp);
                    this.cargarUsuarios();
                },
                  err => {
                    Swal.fire({
                      type: 'error',
                      title: 'Upsss...',
                      text: 'El usuario ' + formValues[0] + ' ya existe!!!'
                    });
                  }
                );
    }

  }

  agregarPermisoUsuario( id: string, claim: string ) {


    this._usuarioService.obtenerUsuario( id )
            .subscribe( (resp: Usuario) => {

              this.usuario = new Usuario(resp.id, resp.name, resp.password, resp.claims);

              const index  = (this.usuario.claims).findIndex(obj => obj.type === claim);

              if (index >= 0) {
                  console.log('Existe Xd');
                  Swal.fire({
                    type: 'error',
                    title: 'Upsss...',
                    text: 'El usuario ya tiene el permiso (' + claim + ')'
                  });
                  return;
              } else {
                  console.log('No Existe');
                  this._usuarioService.agregarPermisoUsuario(id, claim)
                  .subscribe( data => {
                                console.log(data);
                                this.cargarUsuarios();
                              });
              }

            });

  }


  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
      console.log(item);
      console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
      console.log(items);
  }
  onDeSelectAll(items: any) {
      console.log(items);
  }

}
