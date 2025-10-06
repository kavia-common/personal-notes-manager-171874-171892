import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button.component';
import { Note } from '../../core/models/note.model';

/**
 * NoteItemComponent
 * Displays a single note preview with actions.
 */
@Component({
  selector: 'app-note-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DatePipe],
  template: `
    <article class="surface rounded shadow-sm" style="padding:1rem; border:1px solid #e5e7eb;">
      <div style="display:flex; gap:.75rem; align-items:flex-start; justify-content:space-between;">
        <div style="flex:1 1 auto; min-width:0;">
          <h3 style="margin:.1rem 0 .35rem; font-size:1rem; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            {{ note.title || 'Untitled' }}
          </h3>
          <p class="text-muted" style="margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            {{ note.content || '' }}
          </p>
          <div class="text-muted" style="margin-top:.5rem; font-size:.8rem;">
            Updated {{ note.updatedAt | date:'medium' }}
          </div>
        </div>
        <div style="display:flex; gap:.4rem; flex-wrap:wrap;">
          <app-button ariaLabel="Edit note" variant="secondary" text="Edit" (clicked)="edit.emit(note.id)"></app-button>
          <app-button ariaLabel="Delete note" variant="danger" text="Delete" (clicked)="remove.emit(note.id)"></app-button>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();
}
