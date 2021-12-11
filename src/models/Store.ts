import {fireOf} from "../Fire";
import {fromPromise, fromStream, IPromiseBasedObservable, IStreamListener, PENDING} from "mobx-utils";
import {getRandomTitle, Note, noteOf} from "./Note";

export type Store = {
    selectedNoteId: string | undefined,
    selectedNote: Note | undefined,
    notes: IStreamListener<Note[] | undefined>,
    addingNote: IPromiseBasedObservable<void> | undefined,
    updatingNote: IPromiseBasedObservable<void> | undefined,
    deletingNote: IPromiseBasedObservable<void> | undefined,
    addNote: () => void
    select: (noteId: string) => void
    updateNote: (value: string) => void
    deleteNote: () => void;
}

export const storeOf = (): Store => {
    const config = {
        apiKey: "AIzaSyC0SAR5SEFKLYpC_bU1YkW1nUtgdy_jxvM",
        authDomain: "jotter-f6e7c.firebaseapp.com",
        projectId: "jotter-f6e7c",
        storageBucket: "jotter-f6e7c.appspot.com",
        messagingSenderId: "1002517214550",
        appId: "1:1002517214550:web:1ced8a9032303b3cc392f7",
    }
    const fire = fireOf(config)

    return {
        selectedNoteId: undefined,
        select(noteId: string) {
            this.selectedNoteId = noteId
        },
        notes: fromStream(fire.store.notes.all),
        get selectedNote() {
            return this.notes.current?.find(n => n.id === this.selectedNoteId)
        },
        addingNote: undefined,
        updatingNote: undefined,
        addNote() {
            const {addingNote} = this;

            if (addingNote?.state !== PENDING) {
                const title = getRandomTitle()
                const note = noteOf(title)
                const promise = fire.store.notes.set(note);

                this.addingNote = fromPromise(promise, addingNote)
            }
        },
        updateNote(content: string): void {
            const {selectedNoteId, updatingNote} = this

            if (selectedNoteId) {
                const note = noteOf(content, selectedNoteId);
                const updateNote = fire.store.notes.set(note);

                this.updatingNote = fromPromise(updateNote, updatingNote)
            }
        },
        deletingNote: undefined,
        deleteNote(): void {
            const {selectedNoteId, deletingNote} = this

            if (selectedNoteId && deletingNote?.state !== PENDING) {
                const promise = fire.store.notes.delete(selectedNoteId)

                this.deletingNote = fromPromise(promise, deletingNote)
            }
        }
    };
};