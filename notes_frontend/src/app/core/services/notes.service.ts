import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * NotesService
 * Provides CRUD operations for notes via REST API.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseApiUrl}/notes`;

  // PUBLIC_INTERFACE
  listNotes(): Observable<Note[]> {
    /** Returns all notes */
    return this.http.get<Note[]>(this.baseUrl);
  }

  // PUBLIC_INTERFACE
  getNote(id: string): Observable<Note> {
    /** Returns a single note by ID */
    return this.http.get<Note>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  createNote(payload: Partial<Note>): Observable<Note> {
    /** Creates a new note */
    return this.http.post<Note>(this.baseUrl, payload);
  }

  // PUBLIC_INTERFACE
  updateNote(id: string, payload: Partial<Note>): Observable<Note> {
    /** Updates a note by ID */
    return this.http.put<Note>(`${this.baseUrl}/${encodeURIComponent(id)}`, payload);
  }

  // PUBLIC_INTERFACE
  deleteNote(id: string): Observable<{ success: true }> {
    /** Deletes a note by ID */
    return this.http.delete<{ success: true }>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
