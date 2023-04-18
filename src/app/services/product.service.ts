import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProductModel} from "../models/product.model";
import {Observable} from "rxjs";
import {APIEnum} from "../constants/API.enum";
import {CategoryModel} from "../models/category.model";


@Injectable({
  providedIn: "root"
})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  public createProduct(formData: FormData): Observable<ProductModel> {
    return this.http.post<ProductModel>(APIEnum.PRODUCTS, formData).pipe()
  }

  public getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(APIEnum.PRODUCTS).pipe()
  }

  public getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(APIEnum.CATEGORIES).pipe()
  }

  public getProductsByCategory(category: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(APIEnum.PRODUCTS + '/' + category).pipe()
  }

  public getProductById(productId: string): Observable<ProductModel> {
    return this.http.get<ProductModel>(APIEnum.PRODUCTS + '/product/' + productId).pipe()
  }
}
