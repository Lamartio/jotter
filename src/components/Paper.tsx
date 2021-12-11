import React, {FunctionComponent, useState} from "react";
import {Button, ButtonGroup, Card, CardBody, Fade} from "reactstrap";
import Editor from "rich-markdown-editor";
import {useStore} from "../Store+utils";
import {observer} from "mobx-react-lite";
import './Paper.css';
import * as Icon from "react-bootstrap-icons";

export const Paper: FunctionComponent = observer(() => {
    const [isConfirmingDelete, setConfirmingDelete] = useState(false);
    const store = useStore();
    const note = store.selectedNote;

    const deleteNote = () => {
        setConfirmingDelete(false)
        store.deleteNote()
    }

    return <>
        <div className="d-flex flex-row-reverse mt-2 align-items-center pe-2">
            <Fade in={!isConfirmingDelete}>
                <Button color="danger" onClick={() => setConfirmingDelete(!isConfirmingDelete)}
                        className="d-inline-flex align-items-center">
                    <Icon.Trash2/>
                </Button>
            </Fade>
            <span className="p-1"/>
            <Fade in={isConfirmingDelete}>
                <span className="lead text-center flex-fill me-2">Are you sure?</span>
                <ButtonGroup>
                    <Button
                        size="sm"
                        color="danger"
                        outline onClick={() => deleteNote()}
                        className="d-inline-flex align-items-center">
                        Yes
                    </Button>
                    <Button
                        size="sm"
                        color="danger"
                        outline
                        onClick={() => setConfirmingDelete(false)}
                        className="d-inline-flex align-items-center">
                        No
                    </Button>
                </ButtonGroup>
            </Fade>
        </div>
        <Card className="my-4 mx-2 border-0 shadow">
            <CardBody>
                <Editor
                    onChange={getValue => store.updateSelectedNote(getValue())}
                    defaultValue={note?.content}
                    id="markdown-editor"
                    className="ps-5"/>
            </CardBody>
        </Card>
    </>
})