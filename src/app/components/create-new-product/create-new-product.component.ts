import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {LoaderService} from "../../services/loader.service";
import {ProductService} from "../../services/product.service";
import {CategoryModel} from "../../models/category.model";
import {map, Observable, startWith, Subject, takeUntil, tap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductModel} from "../../models/product.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-new-product',
  templateUrl: './create-new-product.component.html',
  styleUrls: ['./create-new-product.component.sass']
})
export class CreateNewProductComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateNewProductComponent>,
              private loaderService: LoaderService,
              private cdr: ChangeDetectorRef,
              private _snackBar: MatSnackBar,
              private productService: ProductService) { }

  private destroy$: Subject<void> = new Subject<void>()

  categories: CategoryModel[];

  categoryControl = new FormControl<CategoryModel>({} as CategoryModel);

  filteredCategories: Observable<CategoryModel[]>;

  isShowLoader: boolean;

  productFormData : FormGroup = new FormGroup<any>({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  })

  customerFiles: FileList;

  ngOnInit(): void {
    this.isShowLoader = true;
    this.productService.getAllCategories().pipe(
      tap((value: CategoryModel[]) => {
        this.categories = value;
        this.isShowLoader = false;
      }),
      takeUntil(this.destroy$),
    ).subscribe();

    this.filteredCategories = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.value;
        return name ? this._filterCategories(name as string) : this.categories?.slice();
      })
    )
  }



  cancel() {
    this.dialogRef.close();
  }

  displayCategoryFn(category: CategoryModel): string {
    return category && !!category?.value ? `${category.value}` : '';
  }

  private _filterCategories(name: string): CategoryModel[] {
    const filterValue = name.toLowerCase();
    return this.categories.filter(category => category?.value?.toLowerCase().includes(filterValue));
  }

  public hasError = (controlName: string, errorName: string, formGroup: FormGroup) => {
    return formGroup.controls[controlName].hasError(errorName);
  }


  createNewProduct() {
      if(this.productFormData.valid) {
        const uploadData = new FormData();
        for (let i = 0; i < this.customerFiles.length; i++) {
          uploadData.append("images", this.customerFiles[i]);
        }
        uploadData.append('name', this.productFormData.controls['name'].value);
        uploadData.append('description', this.productFormData.controls['description'].value);
        uploadData.append('price', this.productFormData.controls['price'].value);
        uploadData.append('category', this.categoryControl.value?.value!);

        this.productService.createProduct(uploadData).pipe(
          takeUntil(this.destroy$),
          tap((product:ProductModel)=> {
            this._snackBar.open(`Product ${product.name} was created`, 'close', {verticalPosition: 'top', duration: 2000});
            this.loaderService.updateAdminPage$.next(true);
            this.dialogRef.close();
          })
        ).subscribe()
      }
  }

  handleFileInputChange(event: any) {
    this.customerFiles = event.target.files
  }
}
