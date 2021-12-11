import React, {FunctionComponent} from "react";
import {Button, ListGroup} from "reactstrap";
import {observer} from "mobx-react-lite";
import {Header} from "./Header";
import {Branch, fold, Item, ItemType, Leaf, noteTreeOf} from "../../noteTreeOf";
import {useStore} from "../../Store+utils";
import {Row} from "./Row";
import {chain} from "lodash";
import * as Icon from 'react-bootstrap-icons';

export const Sider: FunctionComponent = observer(() => {
    const store = useStore();
    const notes = store.notes.current ?? [];
    const tree = noteTreeOf(notes)
    const cases = {
        leaf: (leaf: Leaf) =>
            <Row
                key={leaf.id}
                leaf={leaf}
                isSelected={store.selectedNoteId === leaf.id}
                select={() => store.select(leaf.id)}
            >
                {leaf.title}
            </Row>,
        branch: ({depth, title}: Branch) =>
            <Header key={`${depth}-${title}`} depth={depth}>
                {title}
            </Header>
    };

    return <div>
        <div className="d-flex flex-row my-2 align-items-center">
            <span className="lead text-center flex-fill">Index</span>
            <Button onClick={() => store.addNote()} className="d-inline-flex align-items-center">
                <Icon.Plus/>
            </Button>
        </div>
        <ListGroup flush>
            {flatten(tree).map(item => fold(item, cases))}
        </ListGroup>
    </div>
})

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
