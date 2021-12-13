import React, {FunctionComponent} from "react";
import {Button, ListGroup} from "reactstrap";
import {observer} from "mobx-react-lite";
import {Header} from "./Header";
import {Branch, fold, Leaf} from "../../models/Tree";
import {useStore} from "../../Store+utils";
import {Row} from "./Row";
import * as Icon from 'react-bootstrap-icons';

export const Sider: FunctionComponent = observer(() => {
    const store = useStore();
    const selectedNoteId = store.tree.current?.selected?.id

    const cases = {
        leaf: (leaf: Leaf) =>
            <Row
                key={leaf.id}
                leaf={leaf}
                isSelected={selectedNoteId === leaf.id}
                select={() => store.select(leaf.id)}
            >
                {leaf.title}
            </Row>,
        branch: ({depth, title}: Branch) =>
            <Header key={`${depth}-${title}`} depth={depth}>
                {title}
            </Header>
    };

    return <div className="h-100 overflow-auto">
        <div className="d-flex flex-row my-2 align-items-center">
            <span className="lead text-center flex-fill">Index</span>
            <Button onClick={() => store.addNote()} className="d-inline-flex align-items-center">
                <Icon.Plus/>
            </Button>
        </div>
        <ListGroup flush>
            {store.tree.current?.items?.map(item => fold(item, cases))}
        </ListGroup>
    </div>
})

