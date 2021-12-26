import {fireOf} from "../Fire";
import {fromPromise, IPromiseBasedObservable, PENDING} from "mobx-utils";
import {getRandomTitle, Note, noteOf} from "./Note";
import {asLeaf, isLeaf, Item, itemsOf} from "./Tree";
import {makeAutoObservable} from "mobx";

export type Store = {
    notes: Note[],
    tree: Item[],
    addingNote: IPromiseBasedObservable<void> | undefined,
    updatingNote: IPromiseBasedObservable<void> | undefined,
    deletingNote: IPromiseBasedObservable<void> | undefined,
    addNote: () => void,
    selectedNoteId: string | undefined
    select: (noteId: string) => void
    updateNote: (value: string) => void
    deleteNote: () => void;
}
type Store_ = Store & {
    setNotes: (notes: Note[]) => void
}

export const storeOf = (): Store => {
    const fire = fireOf({
        apiKey: "AIzaSyC0SAR5SEFKLYpC_bU1YkW1nUtgdy_jxvM",
        authDomain: "jotter-f6e7c.firebaseapp.com",
        projectId: "jotter-f6e7c",
        storageBucket: "jotter-f6e7c.appspot.com",
        messagingSenderId: "1002517214550",
        appId: "1:1002517214550:web:1ced8a9032303b3cc392f7",
    })
    const store = makeAutoObservable<Store_>({
        selectedNoteId: undefined,
        select(noteId: string) {
            this.selectedNoteId = noteId;
        },
        notes: [],
        setNotes(notes: Note[]): void {
            this.notes = notes
        },
        get tree() {
            const items = itemsOf(this.notes);
            const selectedIndex: number = items.findIndex(i => isLeaf(i) && asLeaf(i)!.id === this.selectedNoteId)
            const index = selectedIndex !== -1
                ? selectedIndex
                : items.findIndex(isLeaf)

            return items.map((item, i) => ({...item, isSelected: i === index}))
        },
        addingNote: undefined,
        addNote() {
            const {addingNote} = this;

            if (addingNote?.state !== PENDING) {
                const title = getRandomTitle()
                const note = noteOf(title)

                this.notes = [...this.notes, note]
                this.selectedNoteId = note.id
                this.addingNote = fromPromise(fire.store.notes.set(note), addingNote)
            }
        },
        updatingNote: undefined,
        updateNote(content: string): void {
            const {updatingNote, selectedNoteId} = this

            if (selectedNoteId) {
                const note = noteOf(content, selectedNoteId);
                const updateNote = fire.store.notes.set(note);

                this.updatingNote = fromPromise(updateNote, updatingNote)
            }
        },
        deletingNote: undefined,
        deleteNote(): void {
            const {deletingNote, selectedNoteId, notes} = this

            if (selectedNoteId && deletingNote?.state !== PENDING) {
                this.selectedNoteId = undefined
                this.notes = notes.filter(({id}) => id !== selectedNoteId)
                this.deletingNote = fromPromise(fire.store.notes.delete(selectedNoteId), deletingNote)
            }
        }
    })

    fire
        .store
        .notes
        .streamOfAll
        .subscribe(notes => store.setNotes(notes))

    return store;
};