# Shopizer Admin Panel - Architecture

---

## Application Structure

```
src/
├── app/
│   ├── @core/           # Core services & utilities
│   ├── @theme/          # UI theme & components
│   ├── pages/           # Feature modules
│   └── app.module.ts    # Root module
├── assets/              # Static assets
└── environments/        # Environment configs
```

---

## Module Organization

### Feature Modules

```
pages/
├── auth/                # Authentication
├── home/                # Dashboard
├── catalogue/           # Product management
│   ├── products/
│   ├── categories/
│   ├── manufacturers/
│   └── product-options/
├── orders/              # Order management
├── customers/           # Customer management
├── store-management/    # Store configuration
├── user-management/     # Admin users
├── content/             # CMS
├── shipping/            # Shipping configuration
├── payment/             # Payment configuration
└── tax-management/      # Tax configuration
```

---

## Component Architecture

### Smart vs Presentational Components

```
Smart Components (Containers)
- Manage state
- Call services
- Handle business logic
- Located in feature modules

Presentational Components
- Receive data via @Input
- Emit events via @Output
- Reusable UI components
- Located in @theme/components
```

---

## Service Layer

```
@core/data/
├── products.service.ts
├── categories.service.ts
├── orders.service.ts
├── customers.service.ts
└── store.service.ts

Services handle:
- HTTP API calls
- Data transformation
- Error handling
- Caching (if needed)
```

---

## Routing Structure

```
/ → Login
/pages → Main layout
  ├── /home → Dashboard
  ├── /catalogue/products → Products
  ├── /catalogue/categories → Categories
  ├── /orders → Orders
  ├── /customers → Customers
  └── /store-management → Store config
```

### Lazy Loading

```typescript
{
  path: 'catalogue',
  loadChildren: () => import('./pages/catalogue/catalogue.module')
    .then(m => m.CatalogueModule)
}
```

---

## Authentication Flow

```
1. Login page → Enter credentials
2. AuthService.login() → POST /api/v1/private/login
3. Receive JWT token
4. Store token in localStorage
5. Redirect to dashboard
6. HTTP Interceptor adds token to all requests
7. Route guards protect authenticated routes
```

---

## State Management

### Service-Based State

```typescript
@Injectable()
export class StoreStateService {
  private currentStore$ = new BehaviorSubject<Store>(null);
  
  getCurrentStore(): Observable<Store> {
    return this.currentStore$.asObservable();
  }
  
  setCurrentStore(store: Store): void {
    this.currentStore$.next(store);
  }
}
```

---

## HTTP Interceptors

```
1. AuthInterceptor
   - Adds JWT token to headers
   - Handles 401 errors

2. ErrorInterceptor
   - Global error handling
   - Shows error notifications
```

---

## Form Handling

### Reactive Forms Pattern

```typescript
productForm = this.fb.group({
  sku: ['', Validators.required],
  name: ['', Validators.required],
  price: [0, [Validators.required, Validators.min(0)]],
  quantity: [0]
});

onSubmit() {
  if (this.productForm.valid) {
    this.productService.create(this.productForm.value)
      .subscribe(/* ... */);
  }
}
```

---

## Data Table Pattern

```typescript
settings = {
  actions: { add: true, edit: true, delete: true },
  columns: {
    sku: { title: 'SKU' },
    name: { title: 'Name' },
    price: { title: 'Price' }
  }
};

onEdit(event) {
  // Navigate to edit page
}

onDelete(event) {
  // Confirm and delete
}
```

---

## Theme System

### Nebular Theme

```
@theme/
├── components/      # Reusable components
│   ├── header/
│   ├── footer/
│   └── sidebar/
├── layouts/         # Page layouts
│   ├── one-column/
│   └── two-column/
└── styles/          # Global styles
    ├── themes.scss
    └── _variables.scss
```

---

## API Integration

### Service Pattern

```typescript
@Injectable()
export class ProductService {
  private apiUrl = environment.apiUrl;
  
  getProducts(params): Observable<ProductList> {
    return this.http.get<ProductList>(
      `${this.apiUrl}/products`,
      { params }
    );
  }
  
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/products/${id}`
    );
  }
  
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/products`,
      product
    );
  }
}
```

---

## Error Handling

```typescript
this.productService.getProduct(id)
  .pipe(
    catchError(error => {
      this.toastr.error('Failed to load product');
      return throwError(error);
    })
  )
  .subscribe(product => {
    // Handle success
  });
```

---

## File Upload

```typescript
onFileSelect(event) {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  this.productService.uploadImage(formData)
    .subscribe(response => {
      // Handle uploaded image
    });
}
```

---

## Internationalization

```typescript
// In component
constructor(private translate: TranslateService) {
  translate.setDefaultLang('en');
  translate.use('en');
}

// In template
{{ 'PRODUCTS.TITLE' | translate }}

// In translation file (en.json)
{
  "PRODUCTS": {
    "TITLE": "Products"
  }
}
```

---

## Build & Deployment

### Development
```bash
npm install
ng serve
# Access: http://localhost:4200
```

### Production Build
```bash
ng build --prod
# Output: dist/
```

### Docker
```bash
docker build -t shopizer-admin .
docker run -p 82:80 shopizer-admin
```

---

## Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api'
};
```
