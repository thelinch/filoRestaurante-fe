import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventService } from "src/app/core/services/event.service";
import { PedidoService } from "src/app/services/pedido.service";
import { v4 as uuidv4 } from "uuid";
@Component({
  selector: "app-orders-form",
  templateUrl: "./orders-form.component.html",
  styleUrls: ["./orders-form.component.scss"],
})
export class OrdersFormComponent implements OnInit {
  formGroupPedido: FormGroup;
  formGroupPedidoDetalle: FormGroup;
  @Input()
  mostrarBotonSubmit: boolean;
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private pedidoService: PedidoService
  ) {
    this.mostrarBotonSubmit = false;
  }

  ngOnInit(): void {
    this.crearFormularioPedido();
    this.crearFormulatioPedidoDetale();
  }
  crearFormularioPedido() {
    this.formGroupPedido = this.fb.group({
      id: [0],
      cliente: [null, [Validators.required]],
    });
  }
  crearFormulatioPedidoDetale() {
    this.formGroupPedidoDetalle = this.fb.group({
      id: [0],
      fechaPedido: [
        null,
        {
          validators: [Validators.required],
          asyncValidators: [this.pedidoService.fechaValidator()],
          updateOn: "blur",
        },
      ],
      cantidadHembras: ["", [Validators.required, Validators.min(1)]],
    });
  }
  creacionYEdicionDePedidoVenta() {}
}
