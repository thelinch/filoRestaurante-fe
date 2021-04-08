import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  headersUsuario = [
    { headerName: "Nombre Completo", bindValue: "Nombre", isActions: false },
    { headerName: "Correo", bindValue: "email", isActions: false },
    { headerName: "Rol", bindValue: "rol.Rol", isActions: false },
    { headerName: "Acciones", bindValue: "", isActions: true },
  ];
  isLoadingForms: Observable<boolean>;
  formularioUsuario: FormGroup;
  dataUsuarios = [];
  roles = [];
  @ViewChild("createdAndEditUsuario") modalFormUsuario: TemplateRef<any>;
  subscriptionEditUsuarioEvent: Subscription;
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private eventService: EventService
  ) {
    this.isLoadingForms = loaderService.isLoading;
  }
  ngOnDestroy(): void {
    this.subscriptionEditUsuarioEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.crearFormularioUsuario();
    this.listarUsuarios();
    this.listarRoles();
    this.subscriptionEditUsuarioEvent = this.eventService.subscribe(
      "editUsuario",
      (usuario) => {
        this.editarUsuario(usuario);
      }
    );
  }
  async listarUsuarios() {
    this.dataUsuarios = (
      await this.http
        .get<Array<any>>(environment.apiUrl + "/usuario/usuarios/usuariosProy")
        .toPromise()
    ).map((usuario, index) => ({
      ...usuario,
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editUsuario" class="btn btn-success buttonEvent mr2">Editar</button>
    </div>`,
      ],
    }));
    console.log(this.dataUsuarios);
  }
  async listarRoles() {
    this.roles = await this.http
      .get<Array<any>>(environment.apiUrl + "/proyRol/todos")
      .toPromise();
  }
  crearFormularioUsuario() {
    this.formularioUsuario = this.fb.group({
      idUsuario: [0],
      Nombre: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      Password: [{ value: "", disabled: false }, [Validators.required]],
      rol: ["", [Validators.required]],
    });
  }
  crearNuevoUsuario() {
    this.modalService.open(this.modalFormUsuario).hidden.subscribe(() => {
      this.listarUsuarios();
    });
  }

  async crearYActualizarUsuario(usuario: any) {
    console.log("entro al metodo");
    this.formularioUsuario.markAllAsTouched();
    if (this.formularioUsuario.invalid) {
      return;
    }
    let url = "/usuario/usuarioPro/proyUsuario/";
    if (usuario.idUsuario > 0) {
      url = url.concat("editar");
    }
    await this.http.post(environment.apiUrl + url, usuario).toPromise();
    this.modalService.dismissAll();
  }
  get formularioUsuarioControles() {
    return this.formularioUsuario.controls;
  }
  editarUsuario(usuario: any) {
    this.formularioUsuarioControles.Password.clearValidators();
    this.formularioUsuarioControles.Password.disable();

    this.formularioUsuario.patchValue(usuario);
    this.modalService.open(this.modalFormUsuario).hidden.subscribe(() => {
      this.crearFormularioUsuario();
      this.listarUsuarios();
    });
  }

  compareWithRol(a: any, b: any) {
    return a?.idRol === b?.idRol;
  }
}
