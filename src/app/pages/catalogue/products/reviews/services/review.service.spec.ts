import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { CrudService } from '../../../../shared/services/crud.service';

describe('ReviewService', () => {
  let service: ReviewService;
  let crudService: jasmine.SpyObj<CrudService>;

  beforeEach(() => {
    const crudServiceSpy = jasmine.createSpyObj('CrudService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: CrudService, useValue: crudServiceSpy },
      ],
    });

    service = TestBed.inject(ReviewService);
    crudService = TestBed.inject(CrudService) as jasmine.SpyObj<CrudService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getReviews with correct endpoint', () => {
    service.getReviews();
    expect(crudService.get).toHaveBeenCalledWith('/v1/private/products/reviews');
  });

  it('should call createReply with correct endpoint and data', () => {
    const reviewId = 1;
    const comment = 'Test reply';
    service.createReply(reviewId, comment);
    expect(crudService.post).toHaveBeenCalledWith(
      '/v1/private/products/reviews/1/reply',
      { comment: 'Test reply' },
    );
  });

  it('should call updateReply with correct endpoint and data', () => {
    const reviewId = 1;
    const replyId = 2;
    const comment = 'Updated reply';
    service.updateReply(reviewId, replyId, comment);
    expect(crudService.put).toHaveBeenCalledWith(
      '/v1/private/products/reviews/1/reply/2',
      { comment: 'Updated reply' },
    );
  });

  it('should call deleteReply with correct endpoint', () => {
    const reviewId = 1;
    const replyId = 2;
    service.deleteReply(reviewId, replyId);
    expect(crudService.delete).toHaveBeenCalledWith('/v1/private/products/reviews/1/reply/2');
  });

  it('should call deleteReview with correct endpoint', () => {
    const productId = 1;
    const reviewId = 2;
    service.deleteReview(productId, reviewId);
    expect(crudService.delete).toHaveBeenCalledWith('/v1/private/products/1/reviews/2');
  });
});
