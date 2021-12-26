import {chain} from "lodash";
import {Note} from "./Note";

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

export function isLeaf(item: Item): boolean {
    return item.type === ItemType.leaf
}

export function asLeaf(item: Item): Leaf | undefined {
    return isLeaf(item) ? item as Leaf : undefined
}

export function getSelected(items: Item[]): Leaf | undefined {
    return items.find(i => isLeaf(i) && asLeaf(i)?.isSelected) as Leaf | undefined
}