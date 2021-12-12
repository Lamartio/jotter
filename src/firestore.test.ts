import {deleteApp} from "firebase/app";
import {Fire, fireOf} from "./Fire";
import {noteOf} from "./models/Note";


let fire: Fire

beforeAll(() => {
    fire = fireOf({
        apiKey: "AIzaSyC0SAR5SEFKLYpC_bU1YkW1nUtgdy_jxvM",
        authDomain: "jotter-f6e7c.firebaseapp.com",
        projectId: "jotter-f6e7c",
        storageBucket: "jotter-f6e7c.appspot.com",
        messagingSenderId: "1002517214550",
        appId: "1:1002517214550:web:1ced8a9032303b3cc392f7",
    })
})

afterAll(async () => await deleteApp(fire.app))

test('Create a note and get it for comparison', async () => {
    const note = noteOf('hello')
    await fire.store.notes.set(note)
    const remoteNote = await fire.store.notes.read(note.id)

    expect(note).toStrictEqual(remoteNote)
})

test('reading all notes from the database', async () => {
    const notes = await fire.store.notes.readAll()

    expect(notes).toBeTruthy()
    return notes
})