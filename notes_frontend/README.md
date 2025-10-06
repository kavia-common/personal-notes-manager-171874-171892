# Ocean Notes Frontend (Angular)

## Project Overview
Ocean Notes is a simple notes application that allows users to create, read, update, and delete personal notes. This repository contains the Angular frontend. The UI presents a main notes page with search, a list view, and an editor modal for creating and editing notes. The design follows the Ocean Professional theme with modern, minimal styling.

## Tech Stack and Structure
This frontend is built with Angular v19 and leverages standalone components, Angular signals for state management, and the built-in HTTP client with an error interceptor.

Key technologies:
- Angular 19 (standalone components, signals, routing, SSR-ready setup)
- RxJS for observable handling
- Karma/Jasmine for unit tests
- Express server entry for SSR (configured but not required for local dev)

Directory highlights:
- src/app
  - app.config.ts, app.routes.ts: Application providers and route configuration
  - core/
    - models/note.model.ts: Note interface
    - services/notes.service.ts: REST integration
    - state/notes.store.ts: Signals-based store for notes
    - interceptors/http-error.interceptor.ts: Global HTTP error mapping
  - notes/
    - pages/notes-page.component.ts: Main notes page (list and editor modal)
    - components/: Note list, item, empty state, and editor components
  - shared/ui/: Reusable Button and Modal components
- src/environments
  - environment.ts, environment.development.ts: API base URL and production flag
- src/styles.css: Global theme styles for the Ocean Professional look

## Getting Started
To run the development server on port 3000:
1. Install dependencies:
   - npm install
2. Start the dev server:
   - npm start
3. Open the app:
   - http://localhost:3000

The dev port is configured in angular.json under the serve target. If 3000 is busy, adjust the port in angular.json or pass a port at runtime (e.g., ng serve --port 3001).

## Environment Configuration
Environment files define the baseApiUrl used by the NotesService to call the backend.

- src/environments/environment.development.ts
  - production: false
  - baseApiUrl: 'http://localhost:4000/api' (default for local dev)
- src/environments/environment.ts
  - production: true
  - baseApiUrl: '' (placeholder to be set for production)

Update baseApiUrl to point to your backend’s root API path. The NotesService builds endpoints as `${environment.baseApiUrl}/notes`. For example:
- If your backend serves notes at http://localhost:4000/api/notes, keep the development baseApiUrl as 'http://localhost:4000/api'.
- For production, set baseApiUrl to your deployed API base, e.g., 'https://api.example.com'.

## Available NPM Scripts
- npm start: Starts the Angular dev server on port 3000 with host 0.0.0.0
- npm run build: Builds the project for production (outputs to dist/angular)
- npm run watch: Builds in watch mode using the development configuration
- npm test: Runs unit tests via Karma
- npm run serve:ssr:angular: Serves the SSR build via Node (after building with SSR settings)

Note: SSR setup exists (src/server.ts, src/main.server.ts) but local development typically uses the standard dev server.

## Architecture Overview
Routing:
- app.routes.ts configures routes. The default path '' renders NotesPageComponent. Future routes are scaffolded in comments for archived and settings pages.

Components:
- NotesPageComponent: Main page that shows the header, error banner, list or empty state, and the modal editor.
- NotesListComponent: Searchable list over notes with edit and delete actions.
- NoteItemComponent: Single note preview with edit/delete buttons.
- NotesEmptyStateComponent: Guidance when there are no notes yet.
- NoteEditorComponent: Reactive form for creating/editing notes within the modal.
- Shared UI: ButtonComponent and ModalComponent provide reusable accessible UI elements.

Store (signals):
- NotesStore (signals-based state)
  - notes: Note[] list
  - selectedNoteId: currently selected note id
  - loading: boolean
  - error: string|null
  - selectedNote: computed Note|null
  - Methods handle loadNotes, selectNote, create, update, and remove with optimistic updates. Errors set a human-readable message consumed by the page.

Services:
- NotesService encapsulates REST calls to the backend using baseApiUrl:
  - listNotes(): GET /notes
  - getNote(id): GET /notes/:id
  - createNote(payload): POST /notes
  - updateNote(id, payload): PUT /notes/:id
  - deleteNote(id): DELETE /notes/:id

Interceptor:
- httpErrorInterceptor catches HttpErrorResponse and maps common failure shapes to a readable message set on the NotesStore. Messages are shown at the top of the page.

## UI and Styling
The Ocean Professional theme is defined in src/styles.css using CSS variables and utility classes:
- Colors: primary #2563EB (blue), secondary #F59E0B (amber), error #EF4444, background #f9fafb, surface #ffffff, text #111827.
- Utilities: surface, rounded, shadow variants, input, badge, header-gradient, and layout helpers (app-shell, sidebar).
- Components (Button, Modal) rely on these utilities and provide focus styling.

Accessibility Notes:
- ModalComponent uses role="dialog" with aria-modal and supports aria-label, aria-labelledby, and aria-describedby. It also focuses the modal panel on open and restores focus on close. Escape key and backdrop click close the dialog.
- Buttons set aria-labels where appropriate (e.g., close button, actions).
- Form fields include labels and required indicators; errors are shown for invalid inputs.

## Notes Feature
List and Search:
- The notes list renders NoteItem cards. A search box filters notes client-side by title or content and shows a count badge when filtered.

Editor Modal:
- Creating a note opens the modal with an empty NoteEditor form.
- Editing a note opens the modal populated with the selected note’s values.
- The modal emits save or cancel events handled by NotesPageComponent.

CRUD Flow:
- Create: Optimistic insert with a temporary id; upon server response replaces with the created note and selects it. On error, reverts and shows an error.
- Update: Optimistic update; on error, reverts to previous state and shows an error.
- Delete: Optimistic removal and selection clearing if necessary; on error, restores previous list and shows an error.

## Backend Integration
The frontend assumes a REST API with the following endpoints relative to baseApiUrl:
- GET /notes: returns Note[]
- GET /notes/:id: returns Note
- POST /notes: creates a note from { title, content }
- PUT /notes/:id: updates a note
- DELETE /notes/:id: deletes a note

Set environment.baseApiUrl so that `${environment.baseApiUrl}/notes` points to your backend. For example:
- Development default: http://localhost:4000/api
- Production example: https://api.example.com

The Note interface expects:
- id: string
- title: string
- content: string
- createdAt: ISO string
- updatedAt: ISO string
- archived?: boolean

## Testing
Unit tests are configured via Karma/Jasmine. An example spec verifies AppComponent creation and that the sidebar renders the “Ocean Notes” title:
- src/app/app.component.spec.ts

Run tests with:
- npm test

## Future Improvements
Planned or scaffolded enhancements include:
- Archived and Settings pages (routes are commented for future implementation)
- Toast notifications for success/error feedback
- Route guard(s) if authentication is introduced
- Backend error message standardization and i18n if needed

## Running Notes
- Dev server: npm start (http://localhost:3000)
- Build: npm run build (artifacts in dist/angular)
- API base: configure src/environments as described to match your backend

Once your backend is available, update environment.baseApiUrl accordingly so the NotesService can reach the REST endpoints at /notes.
