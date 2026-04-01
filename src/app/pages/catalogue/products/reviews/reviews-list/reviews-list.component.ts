import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ReviewService } from '../services/review.service';
import { ReviewDetailModalComponent } from '../review-detail-modal/review-detail-modal.component';

@Component({
  selector: 'ngx-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss'],
})
export class ReviewsListComponent implements OnInit {
  reviews: any[] = [];
  loading = false;

  constructor(
    private reviewService: ReviewService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviews().subscribe(
      (data) => {
        this.reviews = data.reviews || [];
        this.loading = false;
      },
      (error) => {
        this.toastrService.danger('Failed to load reviews', 'Error');
        this.loading = false;
      },
    );
  }

  openReplyModal(review: any): void {
    this.dialogService.open(ReviewDetailModalComponent, {
      context: { review },
    }).onClose.subscribe((result) => {
      if (result) {
        this.loadReviews();
      }
    });
  }

  getReplyStatus(review: any): string {
    return review.reply ? 'Replied' : 'Not Replied';
  }

  getReplyStatusClass(review: any): string {
    return review.reply ? 'badge-success' : 'badge-warning';
  }
}
