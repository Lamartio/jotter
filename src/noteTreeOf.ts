import {Note} from "./models/Note";
import {chain, concat} from "lodash";

export function noteTreeOf(notes: Note[], depth: number = 0): Item[] {
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
        .map((notes, title) => branchOf(title, depth, noteTreeOf(notes, depth + 1)))
        .orderBy(i => i.title)
        .value()

    return concat(leafs, branches)
}

export enum ItemType {
    leaf = 'leaf',
    branch = 'branch'
}

export type Item = Branch | Leaf

export type Branch = {
    title: string
    children: Item[]
    type: ItemType
    depth: number,
}

export type Leaf = {
    id: string
    title: string
    type: ItemType
    depth: number,
}
const leafOf = ({id, title}: Note, depth: number): Item =>
    ({
        id,
        title,
        type: ItemType.leaf,
        depth,
    });

const branchOf = (title: string, depth: number, children: Item[]): Item =>
    ({
        title,
        children,
        type: ItemType.branch,
        depth,
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