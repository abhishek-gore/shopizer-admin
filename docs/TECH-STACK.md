# Shopizer Admin Panel - Technology Stack

**Framework:** Angular 11  
**UI Library:** Nebular 6.2.0  
**Language:** TypeScript 4.0.8

---

## Core Framework

### Angular 11.2.14
- @angular/core
- @angular/common
- @angular/forms (Reactive & Template-driven)
- @angular/router
- @angular/platform-browser
- @angular/animations

---

## UI Framework

### Nebular 6.2.0
- @nebular/theme - UI components
- @nebular/auth - Authentication
- @nebular/security - Authorization
- @nebular/eva-icons - Icon set
- @nebular/moment - Date handling

### Bootstrap 4.3.1
- Grid system
- Utilities

---

## State Management

- **RxJS 6.5.5** - Reactive programming
- **Services** - Shared state via Angular services
- No Redux (service-based state)

---

## Routing

- **Angular Router 11**
- Lazy loading modules
- Route guards for authentication

---

## Forms & Validation

- **Reactive Forms** - Form handling
- **Angular Validators** - Built-in validation
- **Custom Validators** - Business rules

---

## HTTP & API

- **HttpClient** - REST API calls
- **Interceptors** - JWT token injection
- **RxJS Operators** - Request handling

---

## Rich Text Editor

- **ngx-summernote 0.7.7** - WYSIWYG editor
- **Quill 1.3.7** - Alternative editor

---

## File Management

- **ng6-file-man 3.0.2** - File manager
- **ngx-awesome-uploader 10.0.4** - File upload
- **ngx-dropzone 2.2.2** - Drag & drop upload
- **fine-uploader 5.16.2** - Advanced upload

---

## Data Tables

- **ng2-smart-table 1.5.0** - Data grid
- Sorting, filtering, pagination
- Inline editing

---

## Charts & Visualization

- **ngx-echarts 4.2.2** - Charts
- **echarts 4.0.2** - Charting library
- **ngx-charts 13.0.2** - D3-based charts
- **Chart.js 2.9.3** - Simple charts

---

## UI Components

- **ng-multiselect-dropdown 0.3.4** - Multi-select
- **angular-tree-component 8.5.6** - Tree view
- **ngx-lightbox 2.5.1** - Image lightbox
- **ngx-smart-modal 7.4.1** - Modal dialogs
- **ngx-toastr 12.1.0** - Toast notifications

---

## Internationalization

- **@ngx-translate/core 12.1.2** - i18n
- **@ngx-translate/http-loader 5.0.0** - Translation loader
- Supports: English, French, Spanish, Russian

---

## Date & Time

- **@nebular/moment** - Date handling
- **date-fns 2.25.0** - Date utilities

---

## Utilities

- **libphonenumber-js 1.9.39** - Phone validation
- **jQuery 3.5.1** - DOM manipulation
- **ngx-malihu-scrollbar 9.0.0** - Custom scrollbar

---

## Build & Development

- **Angular CLI 11.2.17**
- **TypeScript 4.0.8**
- **Webpack** (via Angular CLI)
- **Sass 1.43.2** - CSS preprocessor

---

## Code Quality

- **ESLint 7.6.0** - Linting
- **Stylelint 13.6.1** - CSS linting
- **TSLint 6.1.0** - TypeScript linting (deprecated)

---

## Testing

- **Karma 6.3.4** - Test runner
- **Jasmine 3.6.0** - Testing framework
- **Protractor 7.0.0** - E2E testing

---

## DevOps

- **Docker** - Containerization
- **NGINX** - Web server
- **CircleCI** - CI/CD
