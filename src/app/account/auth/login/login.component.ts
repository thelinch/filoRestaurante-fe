import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from "../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";

import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { NgxPermissionsService } from "ngx-permissions";
import { WebsocketService } from "src/app/services/websocket.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private permissionsService: NgxPermissionsService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authFackservice
      .login(this.f.userName.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        async (data) => {
          const permission = [].concat(
            ...data.roles.map((r) => r.actions.map((a) => a.name))
          );
          console.log(permission);
          this.permissionsService.loadPermissions(permission);
          console.log("p", this.permissionsService.getPermissions());
          localStorage.setItem("permisos", JSON.stringify(permission));
          this.webSocketService.connect();
          this.router.navigate(["/dashboards"]);
        },
        (error) => {
          this.error = error ? error : "";
        }
      );
  }
}
