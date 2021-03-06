import {FirebaseApp, FirebaseOptions, initializeApp} from "firebase/app";
import {
    collection,
    deleteDoc,
    doc,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    setDoc
} from "firebase/firestore";
import {identity, Observable} from "rxjs";
import {collectionData} from "rxfire/firestore";
import {Note} from "./models/Note";

const ofType = <T extends {}>(): FirestoreDataConverter<T> => ({
    toFirestore: identity,
    fromFirestore: (snapshot, options): T => (snapshot.data(options) as T)
});

export type Notes = {
    read: (id: string) => Promise<Note | undefined>,
    readAll: () => Promise<Note[]>,
    streamOfAll: Observable<Note[]>,
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
                read: async (id: string) => {
                    const ref = doc(notes, id);
                    const snapshot = await getDoc(ref);
                    return snapshot.data()
                },
                readAll: async () => {
                    const refs = await getDocs(notes);

                    return refs.docs.map(s => s.data())
                },
                get streamOfAll(): Observable<Note[]> {
                    return collectionData(query(notes, orderBy('title')))
                }
            }
        }
    }
}