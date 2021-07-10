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
import { Product } from "src/app/models/Product";
import { ProductView } from "src/app/models/ProductView";
import { CategoriesService } from "src/app/services/categories.service";
import { ProductService } from "src/app/services/product.service";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit, OnDestroy {
  categories: Category[];
  formProduct: FormGroup;
  isLoadingCategories: boolean;
  isLoadingForm: Observable<boolean>;
  subscriptionEditProductEvent: Subscription;
  subscriptionRemoveProductEvent: Subscription;
  productsView: ProductView[];
  products: Product[];
  @ViewChild("editAndCreateProduct") modalFormProduct: TemplateRef<any>;
  headerTables = [
    {
      headerName: "Nombre",
      bindValue: "name",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Cantidad",
      bindValue: "quantity",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Precio",
      bindValue: "price",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Categorias",
      bindValue: "categories",
      isActions: false,
      isTemplate: true,
    },
    {
      headerName: "Acciones",
      bindValue: "name",
      isActions: true,
      isTemplate: false,
    },
  ];
  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private loadingService: LoaderService,
    private modalService: NgbModal,
    private eventService: EventService,
    private productService: ProductService
  ) {
    this.productsView = [];
    this.isLoadingForm = this.loadingService.isLoading;
    this.categories = [];
    this.isLoadingCategories = false;
    this.products = [];
  }
  ngOnDestroy(): void {
    this.subscriptionEditProductEvent?.unsubscribe();
    this.subscriptionRemoveProductEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.createFormProduct();
    this.listProducts();
    this.listCategories();
    this.subscriptionEditProductEvent = this.eventService.subscribe(
      "editEventProduct",
      (product: ProductView) => {
        this.editProduct(this.products.find((p) => p.id == product.id));
      }
    );
    this.subscriptionRemoveProductEvent = this.eventService.subscribe(
      "removeEventProduct",
      (product: ProductView) => {
        this.removeProduct(product.id);
      }
    );
  }
  newProduct() {
    this.formProduct.reset();
    this.modalService.open(this.modalFormProduct);
  }
  async listCategories() {
    this.isLoadingCategories = true;
    this.categories = await this.categoryService.list().toPromise();
    this.isLoadingCategories = false;
  }

  editProduct(product: Product) {
    this.formProduct.patchValue(product);
    this.modalService.open(this.modalFormProduct);
  }
  async removeProduct(productId: string) {
    await this.productService.remove(productId).toPromise();
    this.listProducts();
  }
  async createAndEditProduct() {
    const product = this.formProduct.value as Product;
    console.log(product);
    const uuid = uuidv4();
    if (!product.id) {
      await this.productService.create({ ...product, id: uuid }).toPromise();
    } else {
      await this.productService.update(product).toPromise();
    }
    Swal.fire({
      icon: "success",
      text: `Se ${product.id != null ? "edito" : "creo"} correctamente`,
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
    product.id = uuid;
    await this.listProducts();
    this.modalService.dismissAll();
  }
  createFormProduct() {
    this.formProduct = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      categories: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
  }
  async listProducts() {
    this.products = await this.productService.list().toPromise();
    this.productsView = this.products.map((factor, index) => ({
      ...factor,
      categories: factor.categories.map(
        (c) => `<span  class="badge rounded-pill bg-primary">${c.name}</span>`
      ),
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editEventProduct" class="btn btn-success buttonEvent mr2">Editar</button>
    <button type="button" data-index=${index}   data-function="removeEventProduct" class="btn btn-danger buttonEvent mr2">eliminar</button>
    </div>`,
      ],
    }));
  }
  get formProductControls() {
    return this.formProduct.controls;
  }
}
