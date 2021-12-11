import React, {FunctionComponent} from "react";
import {Button, ListGroup, ListGroupItem} from "reactstrap";
import {useStore} from "./Store";
import {observer} from "mobx-react-lite";
import {Branch, flatten, fold, Leaf, noteTreeOf} from "./noteTreeOf";
import {arrayOf} from "./utils";
import classNames from "classnames";

const paddings = arrayOf(5).map((_, index) => `ps-${index}`)

export const Sider: FunctionComponent = observer(() => {
    const store = useStore();
    const notes = store.notes.current ?? [];
    const tree = noteTreeOf(notes)
    const flatTree = flatten(tree)
    const cases = {
        leaf: ({note, depth, title}: Leaf) =>
            <ListGroupItem
                action
                active={store.selectedNote === note}
                tag="button"
                key={note.id}
                onClick={() => store.select(note)}
            >
                <span className="invisible">{arrayOf(depth).fill('—').join('')}</span>
                {title}
            </ListGroupItem>,
        branch: ({depth, title}: Branch) =>
            <ListGroupItem disabled key={`${depth}-${title}`}>
                <span className={classNames('text-truncate', 'fw-bold', paddings[depth])}>
                    <span className="invisible">{arrayOf(depth).fill('—').join('')}</span>
                    {title}
                </span>
            </ListGroupItem>
    };

    return <div>
        <div className="d-flex flex-row my-2">
            <span className="lead text-center flex-fill">Index</span>
            <Button size="sm" outline onClick={() => store.newNote()}>new</Button>
        </div>
        <ListGroup flush>
            {flatTree.map(item => fold(item)(cases))}
        </ListGroup>
    </div>
})


