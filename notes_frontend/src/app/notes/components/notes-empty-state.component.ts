import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button.component';

/**
 * NotesEmptyStateComponent
 * Shown when there are no notes yet.
 */
@Component({
  selector: 'app-notes-empty-state',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="surface rounded shadow" style="padding:2rem; text-align:center;">
      <div style="font-size:1.5rem; font-weight:600; color:#0f172a; margin-bottom:.5rem;">No notes yet</div>
      <p class="text-muted" style="margin-bottom:1rem;">Create your first note to get started.</p>
      <app-button variant="primary" text="New Note" (clicked)="create.emit()"></app-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesEmptyStateComponent {
  @Output() create = new EventEmitter<void>();
}
