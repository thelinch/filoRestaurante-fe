import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Props } from "src/app/models/PropsForm";
import { PedidoService } from "src/app/services/pedido.service";

@Component({
  selector: "app-clientes-select-form",
  template: `

    <label class="col-md-2 col-form-label">{{ props.name }}</label>
    <ng-select
      [loading]="cargaClientes"
      [multiple]="isMultiple"
      [items]="clientes"
      bindLabel="CL_CNOMCLI"
      loadingText="Cargando clientes"
      [compareWith]="compareCliente"
      (change)="onChange($event)"
      [placeholder]="props.placeholder"
      (blur)="blur()"
      [(ngModel)]="clienteSeleccionado"
      [ngClass]="{
        'is-invalid': invalid
      }"
    ></ng-select>
  `,
  styles: [],
})
export class ClientesSelectFormComponent implements OnInit {
  @Input() from: FormGroup;
  @Input() props: Props;
  @Input() isMultiple: boolean;
  clientes: Array<any>;
  cargaClientes: boolean;
  clienteSeleccionado: any;
  constructor(private pedidoService: PedidoService) {
    this.clientes = [];
    this.cargaClientes = true;
    this.isMultiple = false;
  }

  ngOnInit(): void {
    this.clienteSeleccionado =
      this.from.get(this.props.formControlName)?.value || null;
    this.listarClientes();
  }

  async listarClientes() {
    this.clientes = await this.pedidoService.listarClientes().toPromise();
    this.cargaClientes = false;
  }
  onChange(cliente: any) {
    console.log("clientes Se", cliente);
    this.from.get(this.props.formControlName).setValue(cliente);
  }
  get invalid() {
    return (
      this.from.get(this.props.formControlName).touched &&
      this.props.validators.some((validator) =>
        this.from
          .get(this.props.formControlName)
          .hasError(validator.validatorName)
      )
    );
  }
  blur() {
    this.from.get(this.props.formControlName).markAsTouched({ onlySelf: true });
  }
  compareCliente(cliente: any, clientep: any) {
    return cliente?.CL_CNUMRUC == clientep?.CL_CNUMRUC;
  }
}
