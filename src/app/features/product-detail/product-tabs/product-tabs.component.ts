import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductReview } from '../../../core/models/product.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-tabs',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.css'
})
export class ProductTabsComponent {
  @Input() description: string = '';
  @Input() specs?: { label: string; value: string }[];
  @Input() reviews?: ProductReview[];
  @Input() rating: number = 5;

  activeTab: 'desc' | 'specs' | 'reviews' = 'desc';
}
