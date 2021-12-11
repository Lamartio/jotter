import {noteTreeOf} from "./noteTreeOf";

const notes = [
    {
        "title": "My awesome thought!",
        "content": "My awesome thought!",
        "path": [
            "My awesome thought!"
        ],
        "id": "279143ec-377b-4210-a5b7-6af1c8b72ac8"
    },
    {
        "id": "2d2431e9-ef7b-467b-9916-3dc9101128a3",
        "title": "My awesome thought!",
        "path": [
            "ideas",
            "new",
            "My awesome thought!"
        ],
        "content": "ideas / new / My awesome thought!\n\n\\\nasdasd"
    },
    {
        "path": [
            "ideas",
            "My awesome thought!"
        ],
        "id": "49f71543-41c8-476c-a903-03d3ae27cf23",
        "title": "My awesome thought!",
        "content": "ideas / My awesome thought!\n\n\\\n\\\n\\\n"
    },
    {
        "title": "My awesome thought!",
        "id": "d6b647f5-20cf-4635-ae51-b2797f3b676d",
        "content": "ideas / My awesome thought!",
        "path": [
            "ideas",
            "My awesome thought!"
        ]
    },
    {
        "path": [
            "ideas",
            "My awesome thought!"
        ],
        "id": "da633033-0bb8-4ffa-959e-43c486ffe86c",
        "content": "asdsasadsaideas / My awesome thought!\n\n\\\n\\\n",
        "title": "My awesome thought!"
    },
    {
        "path": [
            "ideas",
            "My awesome thought!"
        ],
        "id": "ea66f357-c375-451f-bcb5-5034658d3535",
        "content": "My awesome thought!\n\n\\\n\\\n# asdasdas",
        "title": "My awesome thought!"
    },
    {
        "content": "asdsasadsaideas / My awesome thought!\n\nsdasdsa\n\n\\\n",
        "path": [
            "ideas",
            "My awesome thought!"
        ],
        "title": "My awesome thought!",
        "id": "f24cc2f2-e811-4b6f-8174-f234f0e86b1e"
    }
]


test('making a recursive beauty for the tree like index', () => {
    const tosti = noteTreeOf(notes);

    console.log(tosti)
    expect(tosti).toBeTruthy()
})

