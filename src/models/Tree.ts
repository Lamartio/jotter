import {chain} from "lodash";
import {Note} from "./Note";
import {combineLatestWith, Observable, scan, startWith} from "rxjs";

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

export type Tree = { selected: Leaf | undefined, items: Item[], notes: Note[] }

const seed: Tree = {selected: undefined, items: [], notes: []}

export const treeStreamOf: (notesStream: Observable<Note[]>, selectedNoteIdStream: Observable<string | undefined>) => Observable<Tree> =
    (notesStream, selectedNoteIdStream) =>
        notesStream.pipe(
            combineLatestWith(selectedNoteIdStream.pipe(startWith(undefined))),
            scan(
                (previous, [notes, selectedId]) => {
                    const items = getItems(notes, selectedId, previous);
                    const selected = items.find(item => asLeaf(item)?.isSelected ?? false) as Leaf | undefined

                    return {notes, items, selected}
                },
                seed
            )
        )

const asLeaf = (item: Item): Leaf | undefined =>
    item.type === ItemType.leaf
        ? item as Leaf
        : undefined;

// when an item got added; select that one
// when an item got selected; select that one
// otherwise select the first one
function getItems(notes: Note[], selectedId: string | undefined, previous: Tree): Item[] {
    const addedNotes = notes.filter(n => !previous.notes.some(pn => n.id === pn.id))

    if (addedNotes.length > 0) { // there is a note added, so selected it
        return itemsOf(notes, leaf => leaf.id === addedNotes[0].id)
    } else if (selectedId && selectedId !== previous.selected?.id) { // there is another note selected, so select it
        return itemsOf(notes, leaf => leaf.id === selectedId)
    } else { // otherwise select first
        return itemsOf(notes, (leaf, index, depth) => index === 0 && depth === 0)
    }
}

type IsSelectedPredicate = (leaf: Leaf, index: number, depth: number) => boolean;

export function itemsOf(notes: Note[], isSelectedPredicate: IsSelectedPredicate = () => false, depth: number = 0): Item[] {
    const isLeaf = (note: Note) => depth >= note.path.length - 1
    const isBranch = (note: Note) => !isLeaf(note)
    const leafs = chain(notes)
        .filter(isLeaf)
        .map((note, index) => {
            const leaf = leafOf(note, depth);
            const isSelected = isSelectedPredicate(leaf, index, depth)

            return ({...leaf, isSelected});
        })
        .orderBy(i => i.title)
        .value()
    const branches = chain(notes)
        .filter(isBranch)
        .groupBy(note => note.path[depth])
        .map((notes, title) => ({title, notes}))
        .orderBy(b => b.title)
        .flatMap(({title, notes}) => [
            branchOf(title, depth),
            ...itemsOf(notes, isSelectedPredicate, depth + 1)
        ])
        .value()

    return [...leafs, ...branches]
}