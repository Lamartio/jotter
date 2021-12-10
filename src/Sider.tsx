import React, {FunctionComponent} from "react";
import {Button, ListGroup, ListGroupItem} from "reactstrap";
import {Note, useStore} from "./Store";
import {observer} from "mobx-react-lite";
import {lastElement} from "./utils";

export const Sider: FunctionComponent = observer(() => {
    const store = useStore();

    const items = store.notes.current
        ?.sort((a, b) => a.title.localeCompare(b.title))
        ?.map(note => ({
            note,
            active: store.selectedNote === note,
            select: () => store.select(note)
        }))
        ?.map(Item)

    return <div>
        <div className="d-flex flex-row my-2">
            <span className="lead text-center flex-fill">Index</span>
            <Button size="sm" outline onClick={() => store.newNote()}>new</Button>
        </div>
        <ListGroup flush>
            {items}
        </ListGroup>
    </div>
})

const Item: FunctionComponent<{ note: Note, active: boolean, select: () => void }> = ({note, active, select}) =>
    <ListGroupItem
        action
        active={active}
        tag="button"
        key={note.id}
        className="text-truncate"
        onClick={select}
    >
        {note.title}
        <sup>{note.path.filter(lastElement)}</sup>
    </ListGroupItem>

