import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CommonModule } from '@angular/common';
import { Note } from '../../core/models/note.model';

/**
 * NoteEditorComponent
 * Form for creating and editing notes.
 */
@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSave()" style="display:grid; gap:1rem;">
      <div>
        <label for="title" class="text-muted" style="display:block; margin-bottom:.35rem;">Title</label>
        <input id="title" class="input" type="text" formControlName="title" required aria-required="true" />
        <div *ngIf="form.controls.title.invalid && (form.controls.title.dirty || form.controls.title.touched)" style="color:var(--color-error); font-size:.85rem; margin-top:.25rem;">
          Title is required.
        </div>
      </div>

      <div>
        <label for="content" class="text-muted" style="display:block; margin-bottom:.35rem;">Content</label>
        <textarea id="content" class="input" formControlName="content" rows="8"></textarea>
      </div>

      <div style="display:flex; gap:.5rem; justify-content:flex-end;">
        <app-button variant="secondary" text="Cancel" ariaLabel="Cancel" (clicked)="cancel.emit()"></app-button>
        <app-button variant="primary" text="Save" ariaLabel="Save note"></app-button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteEditorComponent {
  private fb = new FormBuilder().nonNullable;

  @Input() set note(n: Note | null) {
    if (n) {
      this.form.setValue({
        title: n.title || '',
        content: n.content || '',
      });
    } else {
      this.form.reset({ title: '', content: '' });
    }
  }

  @Output() save = new EventEmitter<{ title: string; content: string }>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    title: ['', [Validators.required]],
    content: ['']
  });

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
