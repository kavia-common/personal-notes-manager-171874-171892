import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * ModalComponent
 * Accessible modal dialog with backdrop, ARIA roles, and simple focus handling.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="open"
      class="modal-backdrop"
      role="presentation"
      (click)="onBackdrop()">
      <div
        class="modal-panel surface"
        role="dialog"
        [attr.aria-label]="ariaLabel"
        aria-modal="true"
        [attr.aria-describedby]="ariaDescribedBy || null"
        [attr.aria-labelledby]="ariaLabelledBy || null"
        (click)="$event.stopPropagation()"
        #panel>
        <header class="header-gradient" style="padding:1rem 1.25rem; border-bottom:1px solid #e5e7eb; border-top-left-radius:16px; border-top-right-radius:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:.5rem;">
            <h2 [id]="ariaLabelledBy || null" style="margin:0; font-size:1.05rem; font-weight:600; color:#0f172a;">
              {{ title }}
            </h2>
            <button class="btn" aria-label="Close dialog" (click)="close.emit()">&times;</button>
          </div>
        </header>
        <section style="padding:1rem 1.25rem;">
          <ng-content></ng-content>
        </section>
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() open = false;
  @Input() title = 'Dialog';
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;
  @Output() close = new EventEmitter<void>();

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;

  private prevFocused?: HTMLElement | null;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (this.open) this.focusPanel();
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  ngOnChanges(): void {
    if (this.open) {
      if (isPlatformBrowser(this.platformId)) {
        const doc: any = (globalThis as any).document;
        const active: any = doc && doc.activeElement ? doc.activeElement : null;
        this.prevFocused = active ?? null;
      }
      this.focusPanel();
    } else {
      this.restoreFocus();
    }
  }

  private focusPanel() {
    // Schedule in microtask; avoids direct timers for SSR/lint
    Promise.resolve().then(() => {
      const el = this.panelRef?.nativeElement;
      if (el) {
        el.setAttribute('tabindex', '-1');
        try {
          el.focus();
        } catch {}
      }
    });
  }

  private restoreFocus() {
    if (isPlatformBrowser(this.platformId)) {
      if ((globalThis as any).document) {
        if (this.prevFocused && typeof this.prevFocused.focus === 'function') {
          try {
            this.prevFocused.focus();
          } catch {}
        }
      }
    }
  }

  onBackdrop() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.close.emit();
  }
}
