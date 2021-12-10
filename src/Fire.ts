import {FirebaseApp, FirebaseOptions, initializeApp} from "firebase/app";
import {Note, noteOf} from "./Store";
import {collection, doc, FirestoreDataConverter, getDoc, getDocs, getFirestore, setDoc} from "firebase/firestore";
import {identity, Observable} from "rxjs";
import {collectionData} from "rxfire/firestore";

const ofType = <T extends {}>(): FirestoreDataConverter<T> => ({
    toFirestore: identity,
    fromFirestore: (snapshot, options): T => (snapshot.data(options) as T)
});

export type Notes = {
    create: () => Promise<Note>,
    read: (id: string) => Promise<Note | undefined>,
    readAll: () => Promise<Note[]>,
    all: Observable<Note[]>
}

export type FireStore = {
    notes: Notes
}

export type Fire = {
    app: FirebaseApp,
    store: FireStore
}

export function fireOf(config: FirebaseOptions) : Fire {
    const app = initializeApp(config)
    const firestore = getFirestore(app)
    const notes = collection(firestore, 'notes').withConverter(ofType<Note>())

    return {
        app,
        store: {
            notes: {
                create: async () => {
                    const note = noteOf('ideas / My awesome thought!');
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