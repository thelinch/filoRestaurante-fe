import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import MetisMenu from "metismenujs/dist/metismenujs";
import { EventService } from "../../core/services/event.service";
import { Router, NavigationEnd } from "@angular/router";
import { PerfectScrollbarDirective } from "ngx-perfect-scrollbar";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { MENU } from "./menu";
import { MenuItem } from "./menu.model";
import { TranslateService } from "@ngx-translate/core";
import { EventEmitter } from "events";
import { AuthfakeauthenticationService } from "src/app/core/services/authfake.service";
import { NgxPermissionsService } from "ngx-permissions";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild("scrollElem") scrollElem: PerfectScrollbarDirective;
  @Input() isCondensed = false;
  menu: any;
  data: any;
  openMobileMenu: boolean;

  @Output() settingsButtonClicked: EventEmitter;
  @Output() mobileMenuButtonClicked: EventEmitter;

  menuItems = [];
  configData;

  @ViewChild("sideMenu") sideMenu: ElementRef;

  constructor(
    private eventService: EventService,
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient,
    private authFackservice: AuthfakeauthenticationService,
    private permissionsService: NgxPermissionsService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        //  this._activateMenuDropdown();
        this.onListScroll(this);
      }
    });
    this.mobileMenuButtonClicked = new EventEmitter();
    this.settingsButtonClicked = new EventEmitter();
    this.mobileMenuButtonClicked.emit("d");
  }

  ngOnInit() {
    this.permissionsService.loadPermissions(
      localStorage.getItem("permisos")
        ? JSON.parse(localStorage.getItem("permisos"))
        : []
    );
    this.openMobileMenu = false;

    this.initialize();
    //  document.body.setAttribute('data-sidebar', 'light');
    this.configData = {
      suppressScrollX: true,
    };

    this.onListScroll(this);
  }
  async hasPermission(permissions: Array<string> = []) {
    return await this.permissionsService.hasPermission(permissions);
  }
  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast("changeLayout", layout);
  }
  cerrarSesion() {
    this.authFackservice.logout();
    this.permissionsService.flushPermissions();
    this.router.navigate(["/account/login"]);
  }
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit("teu");
  }
  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);

    setTimeout(() => {
      this.menu.update();
    },400)
    //this._activateMenuDropdown();
  }

  toggleMenu(event) {
    event.currentTarget.nextElementSibling.classList.toggle("mm-show");
  }

  ngOnChanges() {
    if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  onListScroll(elem: any) {
    if (typeof elem.directiveRef !== "undefined") {
      setTimeout(() => {
        elem.directiveRef.scrollToBottom(0, 0);
      }, 500);
    } else {
      setTimeout(() => {
        const currentPosition = document.getElementsByClassName("mm-active")[0];
        if (currentPosition) {
          if (elem.sideMenu.nativeElement.offsetHeight > 1400)
            elem.scrollElem.directiveRef.scrollToBottom(0, 0);
        }
      }, 300);
    }
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Light sidebar
   */
  lightSidebar() {
    document.body.setAttribute("data-sidebar", "light");
    document.body.setAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-sidebar-size");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-layout-scrollable");
  }

  /**
   * Compact sidebar
   */
  compactSidebar() {
    document.body.setAttribute("data-sidebar-size", "small");
    document.body.setAttribute("data-sidebar", "dark");
    document.body.removeAttribute("data-topbar");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.classList.remove("sidebar-enable");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-layout-scrollable");
  }

  /**
   * Icon sidebar
   */
  iconSidebar() {
    document.body.classList.add("sidebar-enable");
    document.body.classList.add("vertical-collpsed");
    document.body.setAttribute("data-sidebar", "dark");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.removeAttribute("data-topbar");
    document.body.removeAttribute("data-layout-scrollable");
  }

  /**
   * Boxed layout
   */
  boxedLayout() {
    document.body.setAttribute("data-keep-enlarged", "true");
    document.body.setAttribute("data-layout-size", "boxed");
    document.body.setAttribute("data-sidebar", "dark");
    document.body.classList.add("vertical-collpsed");
    document.body.classList.remove("sidebar-enable");
    document.body.removeAttribute("data-topbar");
    document.body.removeAttribute("data-layout-scrollable");
  }

  /**
   * Colored sidebar
   */
  coloredSidebar() {
    document.body.setAttribute("data-sidebar", "colored");
    document.body.removeAttribute("data-sidebar-size");
    document.body.removeAttribute("data-layout-size");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-topbar");
    document.body.removeAttribute("data-layout-scrollable");
  }

  scrollable() {
    document.body.setAttribute("data-layout-scrollable", "true");
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass("mm-active");
    this._removeAllClass("mm-show");
    const links = document.getElementsByClassName("side-nav-link-ref");
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]["pathname"]);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf("/");
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add("active");
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add("mm-active");
        const parent2El = parentEl.parentElement.closest("ul");
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.add("mm-show");
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== "side-menu") {
            parent3El.classList.add("mm-active");
            const childAnchor = parent3El.querySelector(".has-arrow");
            const childDropdown = parent3El.querySelector(".has-dropdown");
            if (childAnchor) {
              childAnchor.classList.add("mm-active");
            }
            if (childDropdown) {
              childDropdown.classList.add("mm-active");
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== "side-menu") {
              parent4El.classList.add("mm-show");
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== "side-menu") {
                parent5El.classList.add("mm-active");
                const childanchor = parent5El.querySelector(".is-parent");
                if (childanchor && parent5El.id !== "side-menu") {
                  childanchor.classList.add("mm-active");
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }
}
