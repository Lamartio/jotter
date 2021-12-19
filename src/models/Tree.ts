import {chain, isEqual} from "lodash";
import {Note} from "./Note";
import {combineLatestWith, distinctUntilChanged, Observable, scan, startWith} from "rxjs";

export enum ItemType {
    leaf = 'leaf',
    branch = 'branch'
}

export type Item = (Branch | Leaf)

export type Branch = {
    title: string
    type: ItemType
    depth: number,
}

export type Leaf = Note & {
    type: ItemType
    depth: number,
    isSelected: boolean
}
export type Tree = {
    id: string | undefined
    sortedIds: string[],
    selected: Leaf | undefined,
    items: Item[],
    notes: Note[]
}

const leafOf = (note: Note, depth: number): Leaf =>
    ({
        ...note,
        depth,
        type: ItemType.leaf,
        isSelected: false
    })

const branchOf = (title: string, depth: number): Branch =>
    ({
        title,
        depth,
        type: ItemType.branch,
    });

type ItemCases<R> = {
    leaf: (leaf: Leaf) => R,
    branch: (branch: Branch) => R
}

export const fold: <R>(item: Item, cases: ItemCases<R>) => R =
    (item, {leaf, branch}) => {
        switch (item.type) {
            case ItemType.leaf:
                return leaf(item as Leaf)
            case ItemType.branch:
                return branch(item as Branch)
        }
    }

const seed: Tree = {selected: undefined, items: [], notes: [], id: undefined, sortedIds: []}

export const treeStreamOf: (notesStream: Observable<Note[]>, selectedNoteIdStream: Observable<string | undefined>) => Observable<Tree> =
    (notesStream, selectedNoteIdStream) =>
        notesStream.pipe(
            distinctUntilChanged(isEqual),
            combineLatestWith(selectedNoteIdStream.pipe(startWith(undefined), distinctUntilChanged())),
            scan(
                (previous, next) => {
                    const notes: Note[] = next[0]
                    const id: string | undefined = next[1]
                    const items = itemsOf(notes)
                    const firstLeaf = items.find(i => i.type === ItemType.leaf) as Leaf | undefined
                    const sortedIds = notes.map(n => n.id).sort();
                    const selectedId = getSelectedId(previous, id, notes, firstLeaf?.id, sortedIds);
                    const selected = items
                        .filter(i => i.type === ItemType.leaf)
                        .map(i => i as Leaf)
                        .find(l => l.id === selectedId);

                    return {
                        id,
                        items,
                        notes,
                        sortedIds,
                        selected
                    }
                },
                seed
            )
        )

function getSelectedId(previous: Tree,
                       id: string | undefined,
                       notes: Note[],
                       firstLeafId: string | undefined,
                       sortedIds: string[]
): string | undefined {
    if (isEqual(previous.sortedIds, sortedIds)) {
        // items didn't change: keep the previous selected, if that isn't there, the first note
        return notes.find(n => n.id === id)?.id ?? firstLeafId
    } else if (notes.length > previous.notes.length) {
        // note added: select the new note
        return notes.find(n => !previous.notes.some(pn => pn.id === n.id))?.id
            ?? notes.find(n => n.id === id)?.id
            ?? firstLeafId
    } else if (notes.length < previous.notes.length) {
        // note removed: select the current or, if that isn't there anymore, the first note
        return notes.find(n => n.id === id)?.id ?? firstLeafId
    }
}

export function itemsOf(notes: Note[], depth: number = 0): Item[] {
    const isLeaf = (note: Note) => depth >= note.path.length - 1
    const isBranch = (note: Note) => !isLeaf(note)
    const leafs = chain(notes)
        .filter(isLeaf)
        .map(note => leafOf(note, depth))
        .orderBy(l => l.title)
        .value()
    const branches = chain(notes)
        .filter(isBranch)
        .groupBy(note => note.path[depth])
        .map((notes, title) => ({title, notes}))
        .orderBy(b => b.title)
        .flatMap(({title, notes}) => [
            branchOf(title, depth),
            ...itemsOf(notes, depth + 1)
        ])
        .value()

    return [...leafs, ...branches]
}