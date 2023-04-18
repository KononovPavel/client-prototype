import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ProductModel} from "../../models/product.model";
import {CategoryModel} from "../../models/category.model";
import {Subject, switchMap, takeUntil, tap} from "rxjs";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.sass']
})
export class ShopPageComponent implements OnInit {

  constructor(private productService: ProductService,
              private router: Router,
              private cdr: ChangeDetectorRef) { }

  products: ProductModel[];

  categories: CategoryModel[];

  isShowLoader: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.isShowLoader = true;
    this.productService.getAllCategories().pipe(
      tap((categories: CategoryModel[]) => {
        this.categories = categories;
        this.isShowLoader = false;
        this.cdr.markForCheck();
      }),
      switchMap((categories: CategoryModel[])=> this.productService.getProductsByCategory(categories[0]?.value)),
      tap((products: ProductModel[]) => this.products = products),
      takeUntil(this.destroy$),
    ).subscribe()

  }


  showProductsBySelectedCategory(event: MatTabChangeEvent) {
    this.isShowLoader = true;
    this.productService.getProductsByCategory(event.tab.textLabel).pipe(
      tap((products: ProductModel[]) => {
        this.products = products;
        this.isShowLoader = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  goToProduct(productId: string) {
    this.router.navigate([`/product/${productId}`])
  }
}
