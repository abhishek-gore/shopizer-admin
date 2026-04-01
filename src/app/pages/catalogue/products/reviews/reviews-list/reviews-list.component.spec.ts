import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsListComponent } from './reviews-list.component';
import { ReviewService } from '../services/review.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { of, throwError } from 'rxjs';

describe('ReviewsListComponent', () => {
  let component: ReviewsListComponent;
  let fixture: ComponentFixture<ReviewsListComponent>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let dialogService: jasmine.SpyObj<NbDialogService>;
  let toastrService: jasmine.SpyObj<NbToastrService>;

  const mockReviews = {
    reviews: [
      {
        id: 1,
        productName: 'Test Product',
        customer: { firstName: 'John', lastName: 'Doe' },
        rating: 4.5,
        description: 'Great product',
        date: '2026-03-25',
        reply: null,
      },
      {
        id: 2,
        productName: 'Another Product',
        customer: { firstName: 'Jane', lastName: 'Smith' },
        rating: 5.0,
        description: 'Excellent',
        date: '2026-03-24',
        reply: { id: 1, comment: 'Thank you!', merchantName: 'Store', date: '2026-03-25' },
      },
    ],
    total: 2,
  };

  beforeEach(async () => {
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviews']);
    const dialogServiceSpy = jasmine.createSpyObj('NbDialogService', ['open']);
    const toastrServiceSpy = jasmine.createSpyObj('NbToastrService', ['success', 'danger']);

    await TestBed.configureTestingModule({
      declarations: [ReviewsListComponent],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: NbDialogService, useValue: dialogServiceSpy },
        { provide: NbToastrService, useValue: toastrServiceSpy },
      ],
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    dialogService = TestBed.inject(NbDialogService) as jasmine.SpyObj<NbDialogService>;
    toastrService = TestBed.inject(NbToastrService) as jasmine.SpyObj<NbToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reviews on init', () => {
    reviewService.getReviews.and.returnValue(of(mockReviews));

    fixture.detectChanges(); // triggers ngOnInit

    expect(reviewService.getReviews).toHaveBeenCalled();
    expect(component.reviews.length).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading reviews fails', () => {
    reviewService.getReviews.and.returnValue(throwError({ error: 'Error' }));

    fixture.detectChanges();

    expect(toastrService.danger).toHaveBeenCalledWith('Failed to load reviews', 'Error');
    expect(component.loading).toBe(false);
  });

  it('should open reply modal when openReplyModal is called', () => {
    const mockDialogRef = { onClose: of(true) };
    dialogService.open.and.returnValue(mockDialogRef as any);
    reviewService.getReviews.and.returnValue(of(mockReviews));

    const review = mockReviews.reviews[0];
    component.openReplyModal(review);

    expect(dialogService.open).toHaveBeenCalled();
  });

  it('should return "Replied" status for review with reply', () => {
    const reviewWithReply = mockReviews.reviews[1];
    const status = component.getReplyStatus(reviewWithReply);
    expect(status).toBe('Replied');
  });

  it('should return "Not Replied" status for review without reply', () => {
    const reviewWithoutReply = mockReviews.reviews[0];
    const status = component.getReplyStatus(reviewWithoutReply);
    expect(status).toBe('Not Replied');
  });

  it('should return correct CSS class for replied review', () => {
    const reviewWithReply = mockReviews.reviews[1];
    const cssClass = component.getReplyStatusClass(reviewWithReply);
    expect(cssClass).toBe('badge-success');
  });

  it('should return correct CSS class for not replied review', () => {
    const reviewWithoutReply = mockReviews.reviews[0];
    const cssClass = component.getReplyStatusClass(reviewWithoutReply);
    expect(cssClass).toBe('badge-warning');
  });

  it('should reload reviews after modal closes with result', () => {
    const mockDialogRef = { onClose: of(true) };
    dialogService.open.and.returnValue(mockDialogRef as any);
    reviewService.getReviews.and.returnValue(of(mockReviews));

    spyOn(component, 'loadReviews');

    component.openReplyModal(mockReviews.reviews[0]);

    expect(component.loadReviews).toHaveBeenCalled();
  });
});
