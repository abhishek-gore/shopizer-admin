import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './pages/shared/services/config.service';
import { of } from 'rxjs';

describe('AppComponent - Smoke Test', () => {
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj('ConfigService', ['getListOfSystemSupportedLanguages']);
    mockConfigService.languages = [];
    mockConfigService.getListOfSystemSupportedLanguages.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        TranslateService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
