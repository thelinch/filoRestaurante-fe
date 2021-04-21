import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ErrorDialogComponent } from "./error-dialog/error-dialog.component";

@Injectable({ providedIn: "root" })
export class ErrorDialogService {
  private opened = false;

  constructor(private modalService: NgbModal) {}

  openDialog(message: string, status?: number): void {
    if (!this.opened) {
      this.opened = true;
      const dialogRef = this.modalService.open(ErrorDialogComponent, {
        backdrop: "static",
        keyboard: false,
      });
      dialogRef.componentInstance.data = { message, status };
      dialogRef.result.then(() => {
        this.opened = false;
      });
    }
  }
}
