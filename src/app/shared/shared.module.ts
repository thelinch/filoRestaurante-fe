import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UIModule } from "./ui/ui.module";

import { WidgetModule } from "./widget/widget.module";
import { ErrorDialogService } from "./errors/error-dialog.service";
import { ErrorDialogComponent } from "./errors/error-dialog/error-dialog.component";

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [CommonModule, UIModule, WidgetModule],
  exports:[ErrorDialogComponent]
})
export class SharedModule {}
