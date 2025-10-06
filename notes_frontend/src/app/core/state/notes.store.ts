import { Injectable, computed, effect, signal } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { Note } from '../models/note.model';
import { finalize } from 'rxjs';

/**
 * NotesStore
 * Holds UI state for notes list, selection, loading, and error handling.
 */
@Injectable({ providedIn: 'root' })
export class NotesStore {
  readonly notes = signal<Note[]>([]);
  readonly selectedNoteId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly selectedNote = computed(() => {
    const id = this.selectedNoteId();
    return this.notes().find(n => n.id === id) ?? null;
  });

  constructor(private readonly api: NotesService) {
    // auto-load notes on first subscription to notes()
    effect(() => {
      // touch to ensure initialization when used
      this.notes();
      if (!this.loading() && (this.notes().length === 0)) {
        this.loadNotes();
      }
    });
  }

  setError(message: string | null) {
    this.error.set(message);
  }

  clearError() {
    this.error.set(null);
  }

  // PUBLIC_INTERFACE
  loadNotes() {
    /** Loads notes from backend and populates store */
    this.loading.set(true);
    this.api.listNotes()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => {
          this.notes.set(items);
        },
        error: () => {
          this.setError('Failed to load notes.');
        }
      });
  }

  // PUBLIC_INTERFACE
  selectNote(id: string | null) {
    /** Selects a note by ID (or clears selection) */
    this.selectedNoteId.set(id);
  }

  // PUBLIC_INTERFACE
  create(title: string, content: string) {
    /** Optimistically create a new note */
    this.clearError();
    const tempId = `tmp-${Date.now()}`;
    const now = new Date().toISOString();
    const optimistic: Note = { id: tempId, title, content, createdAt: now, updatedAt: now, archived: false };
    this.notes.update(list => [optimistic, ...list]);
    this.api.createNote({ title, content }).subscribe({
      next: (created) => {
        this.notes.update(list => list.map(n => n.id === tempId ? created : n));
        this.selectNote(created.id);
      },
      error: () => {
        this.setError('Failed to create note.');
        this.notes.update(list => list.filter(n => n.id !== tempId));
      }
    });
  }

  // PUBLIC_INTERFACE
  update(id: string, patch: Partial<Note>) {
    /** Optimistically update a note */
    this.clearError();
    const prev = this.notes().find(n => n.id === id);
    if (!prev) return;

    const updated: Note = { ...prev, ...patch, updatedAt: new Date().toISOString() };
    this.notes.update(list => list.map(n => n.id === id ? updated : n));

    this.api.updateNote(id, patch).subscribe({
      next: (server) => {
        this.notes.update(list => list.map(n => n.id === id ? server : n));
      },
      error: () => {
        this.setError('Failed to update note.');
        // revert
        this.notes.update(list => list.map(n => n.id === id ? prev : n));
      }
    });
  }

  // PUBLIC_INTERFACE
  remove(id: string) {
    /** Optimistically delete a note */
    this.clearError();
    const prev = this.notes();
    this.notes.set(prev.filter(n => n.id !== id));
    if (this.selectedNoteId() === id) {
      this.selectNote(null);
    }
    this.api.deleteNote(id).subscribe({
      next: () => {},
      error: () => {
        this.setError('Failed to delete note.');
        // revert
        this.notes.set(prev);
      }
    });
  }
}
