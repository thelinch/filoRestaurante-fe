import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    document.body.setAttribute("data-sidebar", "light");
    document.body.setAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-sidebar-size");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-layout-scrollable");
  }
}
