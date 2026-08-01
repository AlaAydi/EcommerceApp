import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.css'
})
export class ProductGalleryComponent implements OnChanges {
  @Input({ required: true }) images: string[] = [];
  @Input() productName: string = '';

  activeImage: string = '';
  isZoomed = false;
  zoomOrigin = 'center center';

  ngOnChanges() {
    if (this.images && this.images.length > 0) {
      this.activeImage = this.images[0];
    }
  }

  selectImage(img: string) {
    this.activeImage = img;
  }

  onMouseMove(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.zoomOrigin = `${x}% ${y}%`;
    this.isZoomed = true;
  }

  onMouseLeave() {
    this.isZoomed = false;
  }
}
