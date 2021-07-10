import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { Category } from "src/app/models/CategoryBodyRequestDto";
import { CategoriesService } from "src/app/services/categories.service";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  formCategory: FormGroup;
  subscriptionEditCategoryEvent: Subscription;
  subscriptionRemoveCategoryEvent: Subscription;
  @ViewChild("editAndCreateCategory") modalFormCategory: TemplateRef<any>;

  headerTables = [
    {
      headerName: "Nombre",
      bindValue: "name",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Es visible",
      bindValue: "isVisible",
      isActions: false,
      isTemplate: false,
    },

    {
      headerName: "Acciones",
      bindValue: "ss",
      isActions: true,
      isTemplate: false,
    },
  ];
  isLoadingForm: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private modalService: NgbModal,
    private eventService: EventService,
    private loadingService: LoaderService
  ) {
    this.isLoadingForm = loadingService.isLoading;
  }
  ngOnDestroy(): void {
    this.subscriptionEditCategoryEvent?.unsubscribe();
    this.subscriptionRemoveCategoryEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.createFormCategory();
    this.listCategory();
    this.subscriptionEditCategoryEvent = this.eventService.subscribe(
      "editEventCategory",
      (table: Category) => {
        this.editCategory(table);
      }
    );
    this.subscriptionRemoveCategoryEvent = this.eventService.subscribe(
      "removeEventCategory",
      (table: Category) => {
        this.removeCategory(table.id);
      }
    );
  }
  createFormCategory() {
    this.formCategory = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      isVisible: [false],
    });
  }
  newCategory() {
    this.formCategory.reset();
    this.modalService.open(this.modalFormCategory);
  }
  async listCategory() {
    this.categories = (await this.categoryService.list().toPromise()).map(
      (factor, index) => ({
        ...factor,
        acciones: [
          `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editEventCategory" class="btn btn-success buttonEvent mr2">Editar</button>
    <button type="button" data-index=${index}   data-function="removeEventCategory" class="btn btn-danger buttonEvent mr2">eliminar</button>
    </div>`,
        ],
      })
    );
  }
  async createAndEditCategory() {
    const category = this.formCategory.value as Category;
    category.isVisible = category.isVisible ? category.isVisible : false;
    const uuid = uuidv4();
    if (!category.id) {
      await this.categoryService.create({ ...category, id: uuid }).toPromise();
    } else {
      await this.categoryService.update(category).toPromise();
    }
    Swal.fire({
      icon: "success",
      text: `Se ${category.id != null ? "edito" : "creo"} correctamente`,
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
    category.id = uuid;
    this.modalService.dismissAll();

    await this.listCategory();
  }
  editCategory(category: Category) {
    this.formCategory.patchValue(category);
    this.modalService.open(this.modalFormCategory);
  }
  async removeCategory(categoryId: string) {
    await this.categoryService.remove(categoryId).toPromise();
    this.listCategory();
  }
  get formCategoryControls() {
    return this.formCategory.controls;
  }
}
