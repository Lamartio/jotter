import {identity} from "rxjs";
import {random} from "lodash";
import {guid} from "../utils";

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
                ?.replace(/^\W*/i, '')
                ?.split(' / ')
                ?.map(t => t.trim())
                ?.filter(identity)
        },
        get title() {
            return this.path[this.path.length - 1] ?? ""
        }
    }
}

export function getRandomTitle(): string {
    const titles = [
        'My next creation',
        'My new idea',
        'My thriving future',
        'My world exploration',
        'My creative vision',
        'My expansive thought',
    ]
    const {length} = titles;
    const index = random(0, length - 1, false)
    const title = titles[index]

    console.log(length, index, title)
    return `0001 ${title}`
}