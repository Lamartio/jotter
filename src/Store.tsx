import {makeAutoObservable} from "mobx";
import React, {FunctionComponent} from "react";
import {fromPromise, fromStream, IPromiseBasedObservable, IStreamListener} from "mobx-utils";
import {v4 as guid} from 'uuid';
import {identity} from "rxjs";
import {fireOf} from "./Fire";

export type Note = {
    id: string
    content: string,
    title: string,
    path: string[]
}

export function noteOf(content: string, id?: string): Note {
    return {
        id: id ?? guid(),
        content,
        get path() {
            return content
                .split('\n', 1)[0]
                ?.split(' / ')
                ?.map(t => t.trim())
                ?.filter(identity)
        },
        get title() {
            return this.path[this.path.length - 1] ?? ""
        }
    }
}

export type Store = {
    selectedNoteId: string | undefined,
    selectedNote: Note | undefined,
    notes: IStreamListener<Note[] | undefined>,
    addingNote: IPromiseBasedObservable<void> | undefined,
    newNote: () => void
    select: (note: Note) => void
}

const storeOf = (): Store => {
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
        newNote() {
            this.addingNote = fromPromise(fire.store.notes.create().then(undefined))
        }
    };
};

const store = makeAutoObservable(storeOf())
const StoreContext = React.createContext(store)
export const StoreProvider: FunctionComponent = ({children}) =>
    <StoreContext.Provider value={store}>
        {children}
    </StoreContext.Provider>
export const useStore = () => React.useContext(StoreContext)

