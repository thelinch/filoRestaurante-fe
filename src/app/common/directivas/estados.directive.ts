import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appEstados]",
})
export class EstadosDirective implements OnInit {
  @Input() estados: Array<string>;
  @Input() estadoActual: string;
  constructor(private el: ElementRef, private render: Renderer2) {
    this.estados = [];
  }
  ngOnInit(): void {
    if (!this.verificarEstado()) {
      this.render.removeChild(this.el.nativeElement, this.el.nativeElement);
/*       this.render.setStyle(this.el.nativeElement, "display", "none");
 */    }
  }
  private verificarEstado() {
    return this.estados.includes(this.estadoActual);
  }
}
