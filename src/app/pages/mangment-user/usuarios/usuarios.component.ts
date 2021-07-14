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
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  headersUsuario = [
    {
      headerName: "Nombre Completo",
      bindValue: "name",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "nombre del usuario",
      bindValue: "userName",
      isActions: false,
      isTemplate: false,
    },

    {
      headerName: "Acciones",
      bindValue: "",
      isActions: true,
      isTemplate: false,
    },
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
      await this.http.get<Array<any>>(environment.apiUrl + "/user/").toPromise()
    ).map((usuario, index) => ({
      ...usuario,
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editUsuario" class="btn btn-success buttonEvent mr2">Editar</button>
    </div>`,
      ],
    }));
  }
  async listarRoles() {
    this.roles = await this.http
      .get<Array<any>>(environment.apiUrl + "/role")
      .toPromise();
  }
  crearFormularioUsuario() {
    this.formularioUsuario = this.fb.group({
      id: [null],
      name: ["", [Validators.required]],
      userName: ["", [Validators.required]],
      password: [{ value: "", disabled: false }, [Validators.required]],
      roles: ["", [Validators.required]],
    });
  }
  crearNuevoUsuario() {
    this.modalService.open(this.modalFormUsuario).hidden.subscribe(() => {
      this.listarUsuarios();
    });
  }

  async crearYActualizarUsuario(usuario: any) {
    this.formularioUsuario.markAllAsTouched();
    if (this.formularioUsuario.invalid) {
      return;
    }
    const uuid = uuidv4();

    if (!usuario.id) {
      await this.http
        .post(environment.apiUrl + "/user", { ...usuario, id: uuid })
        .toPromise();
    } else {
      await this.http
        .post(environment.apiUrl + "/user/" + usuario.id + "/update", usuario)
        .toPromise();
    }
    this.modalService.dismissAll();
  }
  get formularioUsuarioControles() {
    return this.formularioUsuario.controls;
  }
  editarUsuario(usuario: any) {
    this.formularioUsuarioControles.password.clearValidators();
    this.formularioUsuarioControles.password.disable();

    this.formularioUsuario.patchValue(usuario);
    this.modalService.open(this.modalFormUsuario).hidden.subscribe(() => {
      this.crearFormularioUsuario();
      this.listarUsuarios();
    });
  }

  compareWithRol(a: any, b: any) {
    return a?.id === b?.id;
  }
}
