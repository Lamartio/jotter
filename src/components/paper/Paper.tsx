import React, {FunctionComponent} from "react";
import {Card, CardBody} from "reactstrap";
import Editor from "rich-markdown-editor";
import {observer} from "mobx-react-lite";
import './Paper.css';
import {useStore} from "../../Store+utils";
import {Header} from "./Header";

export const Paper: FunctionComponent = observer(() => {
    const store = useStore();
    const note = store.selectedNote;

    return <>
        <Header/>
        <Card className="my-4 mx-2 border-0 shadow">
            <CardBody>
                <Editor key={note?.id}
                        onChange={getValue => store.updateNote(getValue())}
                        defaultValue={note?.content}
                        id="markdown-editor"
                        className="ps-5"/>
            </CardBody>
        </Card>
    </>
})