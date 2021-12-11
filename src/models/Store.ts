import {fireOf} from "../Fire";
import {fromPromise, fromStream, IPromiseBasedObservable, IStreamListener, PENDING} from "mobx-utils";
import {Note, noteOf} from "./Note";

export type Store = {
    selectedNoteId: string | undefined,
    selectedNote: Note | undefined,
    notes: IStreamListener<Note[] | undefined>,
    addingNote: IPromiseBasedObservable<void> | undefined,
    updatingNote: IPromiseBasedObservable<void> | undefined,
    newNote: () => void
    select: (note: Note) => void
    updateSelectedNote: (value: string) => void
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
        select(note): void {
            this.selectedNoteId = note.id
        },
        notes: fromStream(fire.store.notes.all),
        get selectedNote() {
            return this.notes.current?.find(n => n.id === this.selectedNoteId)
        },
        addingNote: undefined,
        updatingNote: undefined,
        newNote() {
            const adding = this.addingNote;

            if (adding?.state !== PENDING)
                this.addingNote = fromPromise(fire.store.notes.create().then(undefined), adding)
        },
        updateSelectedNote(content: string): void {
            const {selectedNote} = this

            if (selectedNote) {
                const note = noteOf(content, selectedNote.id);
                const updateNote = fire.store.notes.set(note);

                this.updatingNote = fromPromise(updateNote, this.updatingNote)
            }
        }
    };
};