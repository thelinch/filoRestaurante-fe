import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PipeTransform,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from "@angular/core";
import { HaderTable, SearchResult } from "./tableModel";
import {
  AdvancedSortableDirective,
  SortDirection,
  SortEvent,
} from "./advanced-sortable.directive";
import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";
import {
  debounceTime,
  delay,
  distinct,
  distinctUntilChanged,
  first,
  last,
  map,
  mapTo,
  switchAll,
  switchMap,
  switchMapTo,
  take,
  tap,
} from "rxjs/operators";
import { EventService } from "src/app/core/services/event.service";
import * as $ from "jquery";
import { v4 as uuidv4 } from "uuid";

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

const compare = (v1: string, v2: string) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort the table data
 * @param tabless Table field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(tables: any[], column: string, direction: string): any[] {
  if (direction === "" || column === "") {
    return tables;
  } else {
    return [...tables].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === "asc" ? res : -res;
    });
  }
}

/**
 * Table Data Match with Search input
 * @param tables Table field value fetch
 * @param term Search the value
 */
function matches(tables: any, term: string, pipe: PipeTransform) {
  return (
    tables.name.toLowerCase().includes(term.toLowerCase()) ||
    tables.position.toLowerCase().includes(term) ||
    tables.office.toLowerCase().includes(term) ||
    pipe.transform(tables.age).includes(term) ||
    tables.date.toLowerCase().includes(term) ||
    tables.salary.toLowerCase().includes(term)
  );
}
@Component({
  selector: "app-table-custom-generic",
  templateUrl: "./table-custom-generic.component.html",
  styleUrls: ["./table-custom-generic.component.scss"],
})
export class TableCustomGenericComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() haders: Array<HaderTable> = [];
  uuid: string;
  @Input() data: Array<any> = [];
  /* @ViewChildren(AdvancedSortableDirective)
  headers: QueryList<AdvancedSortableDirective>; */

  private _loading$ = new BehaviorSubject<boolean>(true);
  // tslint:disable-next-line: variable-name
  private _search$ = new Subject<any>();
  // tslint:disable-next-line: variable-name
  private _tables$ = new BehaviorSubject<any[]>(this.data);
  private _tablesCopy$ = new BehaviorSubject<any[]>(this.data);
  // tslint:disable-next-line: variable-name
  private _total$ = new BehaviorSubject<number>(0);
  subscription;
  private subscriptionTable: Subscription;

  // tslint:disable-next-line: variable-name
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
  };
  ngOnInit(): void {
    this.uuid = uuidv4();
    const $this = this;
    this.subscription = this._search$
      .pipe(
        debounceTime(90),
        distinctUntilChanged(),
        switchMap(() => this._search()),
        delay(90)
      )
      .subscribe((result) => {
        this._tables$.next(result.tables);
        this._total$.next(result.total);
      });

    this.subscriptionTable = this._tables$.subscribe((data) => {
      $(`#${this.uuid}  button.buttonEvent`).off("click");
      $(`#${this.uuid}  button.buttonEvent`).on("click", function () {
        $this.eventService.broadcast(this.getAttribute("data-function"), {
          ...$this.data[this.getAttribute("data-index")],
        });
      });
    });
  }

  constructor(private eventService: EventService) {
    //  this._search$.next();
    this._loading$ = new BehaviorSubject<boolean>(true);
    // tslint:disable-next-line: variable-name
    this._search$ = new Subject<any>();
    // tslint:disable-next-line: variable-name
    this._tables$ = new BehaviorSubject<any[]>(this.data);
    this._tablesCopy$ = new BehaviorSubject<any[]>(this.data);
    // tslint:disable-next-line: variable-name
    this._total$ = new BehaviorSubject<number>(0);
  }
  ngAfterViewInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log("change", changes);
    /*   if (!changes.data?.firstChange) {
      this.data = [...changes.data.currentValue];

      this._tablesCopy$.next([...changes.data.currentValue]);
      this._search$.next(this._state);
    } */
    this.data = [...changes.data.currentValue];

    this._tablesCopy$.next([...changes.data.currentValue]);
    this._search$.next(this._state);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscriptionTable?.unsubscribe();
  }
  public setDataTable(data: Array<any>, object: string = "") {
    this.data = [...data];
    this._tablesCopy$.next([...data]);
    this._search$.next(this._state);
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    /*   this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    }); */
    this.sortColumn = column;
    this.sortDirection = direction;
  }
  getValueData(bindValue: string, object: any) {
    return bindValue.split(".").reduce((p, c) => p?.[c], object);
  }
  /**
   * Returns the value
   */
  get tables$() {
    return this._tables$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  get startIndex() {
    return this._state.startIndex;
  }
  get endIndex() {
    return this._state.endIndex;
  }
  get totalRecords() {
    return this._state.totalRecords;
  }

  /**
   * set the value
   */
  // tslint:disable-next-line: adjacent-overload-signatures
  set page(page: number) {
    this._set({ page });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  // tslint:disable-next-line: adjacent-overload-signatures
  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next(this._state[Object.keys(patch)[0]]);
  }

  /**
   * Search Method
   */
  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    //let tables = sort(this._tables$.value, sortColumn, sortDirection);

    // 2. filter
    const arrayHeadersValues = this.haders.map((e) => e.bindValue);

    let tables = this._tablesCopy$.value.filter(
      (table) =>
        arrayHeadersValues.find((val) =>
          this.getValueData(val, table)
            ?.toString()
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
        ) != null
      /* matches(table, searchTerm, this.pipe) */
    );
    const total = tables.length;

    // 3. paginate
    this.totalRecords = tables.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    tables = tables.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ tables, total });
  }
}
