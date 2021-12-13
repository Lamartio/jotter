import {chain, concat} from "lodash";
import {Note} from "./Note";
import {combineLatestWith, map, Observable, startWith} from "rxjs";

export function tree(notes: Note[], depth: number = 0): Item[] {
    const isLeaf = (note: Note) => depth >= note.path.length - 1
    const isBranch = (note: Note) => !isLeaf(note)
    const leafs = chain(notes)
        .filter(isLeaf)
        .map(note => leafOf(note, depth))
        .orderBy(i => i.title)
        .value()
    const branches = chain(notes)
        .filter(isBranch)
        .groupBy(note => note.path[depth])
        .map((notes, title) => branchOf(title, depth, tree(notes, depth + 1)))
        .orderBy(i => i.title)
        .value()

    return concat(leafs, branches)
}

export enum ItemType {
    leaf = 'leaf',
    branch = 'branch'
}

export type Item = (Branch | Leaf)

export type Branch = {
    title: string
    children: Item[]
    type: ItemType
    depth: number,
}

export type Leaf = Note & {
    type: ItemType
    depth: number,
    isSelected: boolean
}

export function flatten(items: Item[]): Item[] {
    return chain(items)
        .flatMap(item =>
            item.type === ItemType.leaf
                ? [item as Item]
                : [
                    {...item, children: []},
                    ...flatten((item as Branch).children)
                ]
        )
        .value()
}

const leafOf = (note: Note, depth: number): Item =>
    ({
        ...note,
        depth,
        type: ItemType.leaf,
        isSelected: false
    })

const branchOf = (title: string, depth: number, children: Item[]): Item =>
    ({
        title,
        children,
        type: ItemType.branch,
        depth,
    });

const dirOf = (title: string, depth: number): Item =>
    ({
        title,
        children: [],
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

export type Tree = { selected: Leaf | undefined, items: Item[] }
export const treeChangesOf: (notesChanges: Observable<Note[]>, selectedNoteIdChanges: Observable<string | undefined>) => Observable<Tree> =
    (noteChanges, selectedNoteIdChanges) => noteChanges.pipe(
        combineLatestWith(selectedNoteIdChanges.pipe(startWith(undefined))),
        map(([notes, selectedId]) => {
            const items = itemsOf(notes).map(item =>
                item.type === ItemType.leaf
                    ? ({...item, isSelected: (item as Leaf)?.id === selectedId})
                    : item
            )
            const selected = items.find(item => (item as Leaf | undefined)?.isSelected) as (Leaf | undefined)

            return {selected, items};
        })
    )

export function itemsOf(notes: Note[], depth: number = 0): Item[] {
    const isLeaf = (note: Note) => depth >= note.path.length - 1
    const isBranch = (note: Note) => !isLeaf(note)
    const leafs = chain(notes)
        .filter(isLeaf)
        .map(note => leafOf(note, depth))
        .orderBy(i => i.title)
        .value()
    const branches = chain(notes)
        .filter(isBranch)
        .groupBy(note => note.path[depth])
        .map((notes, title) => ({title, notes}))
        .orderBy(b => b.title)
        .flatMap(({title, notes}) => [
            dirOf(title, depth),
            ...itemsOf(notes, depth + 1)
        ])
        .value()

    return [...leafs, ...branches]
}