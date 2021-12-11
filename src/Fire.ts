import {FirebaseApp, FirebaseOptions, initializeApp} from "firebase/app";
import {
    collection,
    deleteDoc,
    doc,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    getFirestore,
    setDoc
} from "firebase/firestore";
import {identity, Observable} from "rxjs";
import {collectionData} from "rxfire/firestore";
import {Note, noteOf} from "./models/Note";

const ofType = <T extends {}>(): FirestoreDataConverter<T> => ({
    toFirestore: identity,
    fromFirestore: (snapshot, options): T => (snapshot.data(options) as T)
});

export type Notes = {
    create: () => Promise<Note>,
    read: (id: string) => Promise<Note | undefined>,
    readAll: () => Promise<Note[]>,
    all: Observable<Note[]>,
    set: (note: Note) => Promise<void>
    delete(id: string): Promise<void>;
}

export type FireStore = {
    notes: Notes
}

export type Fire = {
    app: FirebaseApp,
    store: FireStore
}

export function fireOf(config: FirebaseOptions): Fire {
    const app = initializeApp(config)
    const firestore = getFirestore(app)
    const notes = collection(firestore, 'notes').withConverter(ofType<Note>())

    return {
        app,
        store: {
            notes: {
                async delete(id: string) {
                    const noteRef = doc(notes, id);

                    await deleteDoc(noteRef)
                },
                async set(note: Note) {
                    const noteRef = doc(notes, note.id);

                    await setDoc(noteRef, note)
                },
                create: async () => {
                    const note = noteOf('0001 - new note');
                    const noteRef = doc(notes, note.id);

                    await setDoc(noteRef, note)

                    return note
                },
                read: async (id: string) => {
                    const ref = doc(notes, id);
                    const snapshot = await getDoc(ref);
                    return snapshot.data()
                },
                readAll: async () => {
                    const refs = await getDocs(notes);

                    return refs.docs.map(s => s.data())
                },
                get all(): Observable<Note[]> {
                    return collectionData(notes)
                }
            }
        }
    }
}