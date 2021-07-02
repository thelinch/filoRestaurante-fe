import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { flatMap, map, switchMap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { User } from "../models/auth.models";

@Injectable({ providedIn: "root" })
export class AuthfakeauthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, Password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth-proyeccion`, { email, Password })
      .pipe(
        map((dataUser) => {
          // login successful if there's a jwt token in the response
          if (dataUser && dataUser.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(dataUser));
            this.currentUserSubject.next(dataUser);
          }
          return dataUser;
        }),
        switchMap((dataUser) => {

          return this.listarPermisos(dataUser.User.id);
        })
      );
  }
  listarPermisos(idUsuario: number) {
    return this.http.get<Array<string>>(`${environment.apiUrl}/usuario/permisos-proyeccion/${idUsuario}`);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
