import {v4 as guid} from "uuid";
import {identity} from "rxjs";

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