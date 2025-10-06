import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NotesStore } from '../../core/state/notes.store';
import { NotesListComponent } from '../components/notes-list.component';
import { NotesEmptyStateComponent } from '../components/notes-empty-state.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { NoteEditorComponent } from '../components/note-editor.component';
import { ButtonComponent } from '../../shared/ui/button.component';

/**
 * NotesPageComponent
 * Main page to view notes and create/edit them via a modal editor.
 */
@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, NgIf, NotesListComponent, NotesEmptyStateComponent, ModalComponent, NoteEditorComponent, ButtonComponent],
  template: `
    <header class="surface rounded shadow header-gradient" style="padding:1rem 1.25rem; border:1px solid #e5e7eb; margin-bottom:1rem;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:.75rem;">
        <div style="display:flex; align-items:center; gap:.5rem;">
          <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#dbeafe,#ffffff);display:grid;place-items:center;color:var(--color-primary);font-weight:700;">N</div>
          <div>
            <div style="font-weight:700; color:#0f172a;">All Notes</div>
            <div class="text-muted" style="font-size:.85rem;">Manage your personal notes</div>
          </div>
        </div>
        <app-button variant="primary" text="New Note" ariaLabel="Create new note" (clicked)="openCreate()"></app-button>
      </div>
    </header>

    <section *ngIf="store.error()" style="margin-bottom:1rem;">
      <div class="surface rounded" style="border:1px solid rgba(239,68,68,0.25); color:#991b1b; background:#fee2e2; padding:.75rem 1rem;">
        {{ store.error() }}
      </div>
    </section>

    <ng-container *ngIf="store.notes().length > 0; else empty">
      <app-notes-list
        [notes]="store.notes()"
        (edit)="onEdit($event)"
        (remove)="onRemove($event)">
      </app-notes-list>
    </ng-container>

    <ng-template #empty>
      <app-notes-empty-state (create)="openCreate()"></app-notes-empty-state>
    </ng-template>

    <app-modal
      [open]="editorOpen()"
      title="{{ editMode() ? 'Edit Note' : 'New Note' }}"
      ariaLabel="Note editor"
      (close)="closeEditor()">
      <app-note-editor
        [note]="store.selectedNote()"
        (save)="onSave($event)"
        (cancel)="closeEditor()">
      </app-note-editor>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesPageComponent {
  editorOpen = signal(false);
  editMode = signal(false);

  constructor(public readonly store: NotesStore) {}

  openCreate() {
    this.editMode.set(false);
    this.store.selectNote(null);
    this.editorOpen.set(true);
  }

  onEdit(id: string) {
    this.editMode.set(true);
    this.store.selectNote(id);
    this.editorOpen.set(true);
  }

  onRemove(id: string) {
    this.store.remove(id);
  }

  onSave(data: { title: string; content: string }) {
    if (this.editMode()) {
      const id = this.store.selectedNoteId();
      if (id) this.store.update(id, data);
    } else {
      this.store.create(data.title, data.content);
    }
    this.closeEditor();
  }

  closeEditor() {
    this.editorOpen.set(false);
  }
}
