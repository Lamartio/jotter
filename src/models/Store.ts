import {fireOf} from "../Fire";
import {fromPromise, fromStream, IPromiseBasedObservable, IStreamListener, PENDING} from "mobx-utils";
import {getRandomTitle, Note, noteOf} from "./Note";
import {flatten, Item, ItemType, Leaf, noteTreeOf} from "../noteTreeOf";

export type Store = {
    selectedNoteId: string | undefined,
    selectedNote: Note | undefined,
    notes: IStreamListener<Note[] | undefined>,
    tree: Item[],
    addingNote: IPromiseBasedObservable<void> | undefined,
    updatingNote: IPromiseBasedObservable<void> | undefined,
    deletingNote: IPromiseBasedObservable<void> | undefined,
    addNote: () => void,
    invalidateSelectedNote: (noteId?: string) => void,
    ensureSelectedNote: (noteId?: string) => void,
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
        get tree() {
            return noteTreeOf(this.notes.current ?? [])
        },
        addingNote: undefined,
        updatingNote: undefined,
        addNote() {
            const {addingNote} = this;

            if (addingNote?.state !== PENDING) {
                const title = getRandomTitle()
                const note = noteOf(title)
                const promise = fire.store.notes.set(note).then(() => this.invalidateSelectedNote(note.id));

                this.addingNote = fromPromise(promise, addingNote)
            }
        },
        invalidateSelectedNote(noteId?: string): void {
            this.selectedNoteId = undefined
            this.ensureSelectedNote(noteId)
        },
        ensureSelectedNote(noteId?: string): void {
            if (!this.selectedNoteId) {
                if (!noteId) {
                    const tree = this.tree;
                    const item = flatten(tree).find(item => item.type === ItemType.leaf)
                    const leaf = item as (Leaf | undefined)
                    noteId = leaf?.id
                }

                this.selectedNoteId = noteId
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
                const promise = fire.store.notes.delete(selectedNoteId).then(() => this.invalidateSelectedNote());

                this.deletingNote = fromPromise(promise, deletingNote)
            }
        }
    };
};