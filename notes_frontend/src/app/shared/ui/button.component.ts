import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ButtonComponent
 * Reusable styled button with variants.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="btn rounded focus-ring"
      [ngClass]="variantClass"
      [attr.aria-label]="ariaLabel || text || null"
      [disabled]="disabled"
      (click)="onClick($event)">
      <ng-content></ng-content>
      <span *ngIf="text">{{ text }}</span>
    </button>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() text?: string;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'default' = 'default';
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  @Output() clicked = new EventEmitter<unknown>();

  get variantClass() {
    switch (this.variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-danger';
      default: return '';
    }
  }

  onClick(event: unknown) {
    this.clicked.emit(event);
  }
}
