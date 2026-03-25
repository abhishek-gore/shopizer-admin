import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewDetailModalComponent } from './review-detail-modal.component';
import { ReviewService } from '../services/review.service';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ReviewDetailModalComponent', () => {
  let component: ReviewDetailModalComponent;
  let fixture: ComponentFixture<ReviewDetailModalComponent>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let dialogRef: jasmine.SpyObj<NbDialogRef<ReviewDetailModalComponent>>;
  let toastrService: jasmine.SpyObj<NbToastrService>;

  const mockReview = {
    id: 1,
    productName: 'Test Product',
    customer: { firstName: 'John', lastName: 'Doe' },
    rating: 4.5,
    description: 'Great product',
    date: '2026-03-25',
    reply: null
  };

  const mockReviewWithReply = {
    ...mockReview,
    reply: { id: 1, comment: 'Thank you!', merchantName: 'Store', date: '2026-03-25' }
  };

  beforeEach(async () => {
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['createReply', 'updateReply', 'deleteReply']);
    const dialogRefSpy = jasmine.createSpyObj('NbDialogRef', ['close']);
    const toastrServiceSpy = jasmine.createSpyObj('NbToastrService', ['success', 'danger', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [ReviewDetailModalComponent],
      imports: [FormsModule],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: NbDialogRef, useValue: dialogRefSpy },
        { provide: NbToastrService, useValue: toastrServiceSpy }
      ]
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    dialogRef = TestBed.inject(NbDialogRef) as jasmine.SpyObj<NbDialogRef<ReviewDetailModalComponent>>;
    toastrService = TestBed.inject(NbToastrService) as jasmine.SpyObj<NbToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDetailModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with review data', () => {
    component.review = mockReview;
    fixture.detectChanges();
    
    expect(component.replyComment).toBe('');
    expect(component.isEditing).toBe(false);
  });

  it('should initialize with existing reply comment', () => {
    component.review = mockReviewWithReply;
    fixture.detectChanges();
    
    expect(component.replyComment).toBe('Thank you!');
  });

  it('should show warning when saving empty reply', () => {
    component.review = mockReview;
    component.replyComment = '';
    
    component.saveReply();
    
    expect(toastrService.warning).toHaveBeenCalledWith('Please enter a reply', 'Warning');
    expect(reviewService.createReply).not.toHaveBeenCalled();
  });

  it('should create new reply successfully', () => {
    component.review = mockReview;
    component.replyComment = 'New reply';
    reviewService.createReply.and.returnValue(of({ id: 1, comment: 'New reply' }));
    
    component.saveReply();
    
    expect(reviewService.createReply).toHaveBeenCalledWith(1, 'New reply');
    expect(toastrService.success).toHaveBeenCalledWith('Reply posted successfully', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should handle error when creating reply fails', () => {
    component.review = mockReview;
    component.replyComment = 'New reply';
    reviewService.createReply.and.returnValue(throwError({ error: 'Error' }));
    
    component.saveReply();
    
    expect(toastrService.danger).toHaveBeenCalledWith('Failed to post reply', 'Error');
    expect(component.loading).toBe(false);
  });

  it('should update existing reply successfully', () => {
    component.review = mockReviewWithReply;
    component.replyComment = 'Updated reply';
    reviewService.updateReply.and.returnValue(of({}));
    
    component.saveReply();
    
    expect(reviewService.updateReply).toHaveBeenCalledWith(1, 1, 'Updated reply');
    expect(toastrService.success).toHaveBeenCalledWith('Reply updated successfully', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should handle error when updating reply fails', () => {
    component.review = mockReviewWithReply;
    component.replyComment = 'Updated reply';
    reviewService.updateReply.and.returnValue(throwError({ error: 'Error' }));
    
    component.saveReply();
    
    expect(toastrService.danger).toHaveBeenCalledWith('Failed to update reply', 'Error');
    expect(component.loading).toBe(false);
  });

  it('should delete reply successfully after confirmation', () => {
    component.review = mockReviewWithReply;
    reviewService.deleteReply.and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteReply();
    
    expect(reviewService.deleteReply).toHaveBeenCalledWith(1, 1);
    expect(toastrService.success).toHaveBeenCalledWith('Reply deleted successfully', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should not delete reply if user cancels confirmation', () => {
    component.review = mockReviewWithReply;
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteReply();
    
    expect(reviewService.deleteReply).not.toHaveBeenCalled();
  });

  it('should enable edit mode', () => {
    component.isEditing = false;
    
    component.enableEdit();
    
    expect(component.isEditing).toBe(true);
  });

  it('should close modal on cancel', () => {
    component.cancel();
    
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
