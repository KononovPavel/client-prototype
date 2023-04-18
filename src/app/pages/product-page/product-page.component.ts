import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../../services/product.service";
import {Subject, Subscription, switchMap, takeUntil, tap} from "rxjs";
import {ProductModel} from "../../models/product.model";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.sass']
})
export class ProductPageComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute) {
  }

  private destroy$: Subject<void> = new Subject<void>();
  private subscription: Subscription;
  private productId: string;
  product: ProductModel;
  isShowLoader: boolean = false;

  selectedImage: string;

  ngOnInit(): void {
    this.isShowLoader = true;
    this.subscription = this.route.params.pipe(
      tap((param:Params)=> {
        this.productId = param['productId'];
      }),
      switchMap(()=> this.productService.getProductById(this.productId)),
      tap((product: ProductModel)=> {
        this.product = product;
        this.selectedImage = this.product.images[0]
        this.isShowLoader = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  byProduct(productId: string) {
    localStorage.setItem("url", `/product/${this.product.productId}`);
    this.router.navigate([`/plan/buy/PRODUCT/${this.product.productId}`]);
  }

  changeSeletedImage(image: string) {
    this.selectedImage = image;
    this.cdr.markForCheck();
  }

  backToShop() {
    this.router.navigate(['/shop'])
  }
}
