import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'ngx-review-detail-modal',
  templateUrl: './review-detail-modal.component.html',
  styleUrls: ['./review-detail-modal.component.scss']
})
export class ReviewDetailModalComponent implements OnInit {
  @Input() review: any;
  
  replyComment = '';
  isEditing = false;
  loading = false;

  constructor(
    protected ref: NbDialogRef<ReviewDetailModalComponent>,
    private reviewService: ReviewService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    if (this.review.reply) {
      this.replyComment = this.review.reply.comment;
      this.isEditing = false;
    }
  }

  saveReply(): void {
    if (!this.replyComment.trim()) {
      this.toastrService.warning('Please enter a reply', 'Warning');
      return;
    }

    this.loading = true;

    if (this.review.reply) {
      // Update existing reply
      this.reviewService.updateReply(this.review.id, this.review.reply.id, this.replyComment).subscribe(
        () => {
          this.toastrService.success('Reply updated successfully', 'Success');
          this.loading = false;
          this.ref.close(true);
        },
        (error) => {
          this.toastrService.danger('Failed to update reply', 'Error');
          this.loading = false;
        }
      );
    } else {
      // Create new reply
      this.reviewService.createReply(this.review.id, this.replyComment).subscribe(
        () => {
          this.toastrService.success('Reply posted successfully', 'Success');
          this.loading = false;
          this.ref.close(true);
        },
        (error) => {
          this.toastrService.danger('Failed to post reply', 'Error');
          this.loading = false;
        }
      );
    }
  }

  deleteReply(): void {
    if (confirm('Are you sure you want to delete this reply?')) {
      this.loading = true;
      this.reviewService.deleteReply(this.review.id, this.review.reply.id).subscribe(
        () => {
          this.toastrService.success('Reply deleted successfully', 'Success');
          this.loading = false;
          this.ref.close(true);
        },
        (error) => {
          console.error('Delete reply error:', error);
          this.toastrService.danger('Failed to delete reply: ' + (error.error?.message || error.message || 'Unknown error'), 'Error');
          this.loading = false;
        }
      );
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancel(): void {
    this.ref.close(false);
  }
}
