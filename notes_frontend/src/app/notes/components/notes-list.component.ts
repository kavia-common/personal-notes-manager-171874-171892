import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../core/models/note.model';
import { NoteItemComponent } from './note-item.component';

/**
 * NotesListComponent
 * Renders a searchable list of notes.
 */
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, NoteItemComponent],
  template: `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1rem;">
      <input
        class="input"
        type="search"
        placeholder="Search notes..."
        aria-label="Search notes"
        (input)="onInput($event)">
      <span class="badge" *ngIf="filtered().length !== totalCount()">{{ filtered().length }} / {{ totalCount() }}</span>
    </div>

    <div *ngIf="filtered().length === 0" class="text-muted" style="padding:1rem; text-align:center;">
      No notes match your search.
    </div>

    <div style="display:grid; gap:.75rem;">
      <app-note-item
        *ngFor="let n of filtered(); trackBy: trackById"
        [note]="n"
        (edit)="edit.emit($event)"
        (remove)="remove.emit($event)">
      </app-note-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesListComponent {
  @Input() notes: Note[] | null = [];
  @Output() edit = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  private query = signal<string>('');

  filtered: Signal<Note[]> = computed(() => {
    const list = this.notes || [];
    const q = this.query().toLowerCase().trim();
    if (!q) return list;
    return list.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  });

  totalCount(): number {
    return (this.notes?.length) ?? 0;
  }

  onInput(ev: unknown) {
    const anyEv = ev as any;
    const value = (anyEv && anyEv.target && anyEv.target.value) ? String(anyEv.target.value) : '';
    this.query.set(value);
  }

  trackById = (_: number, item: Note) => item.id;
}
