import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private crudService: CrudService) {}

  getReviews(): Observable<any> {
    return this.crudService.get('/v1/private/products/reviews');
  }

  createReply(reviewId: number, comment: string): Observable<any> {
    return this.crudService.post(`/v1/private/products/reviews/${reviewId}/reply`, { comment });
  }

  updateReply(reviewId: number, replyId: number, comment: string): Observable<any> {
    return this.crudService.put(`/v1/private/products/reviews/${reviewId}/reply/${replyId}`, { comment });
  }

  deleteReply(reviewId: number, replyId: number): Observable<any> {
    return this.crudService.delete(`/v1/private/products/reviews/${reviewId}/reply/${replyId}`);
  }

  deleteReview(productId: number, reviewId: number): Observable<any> {
    return this.crudService.delete(`/v1/private/products/${productId}/reviews/${reviewId}`);
  }
}
