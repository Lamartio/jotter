import React, {FunctionComponent} from "react";
import {Card, CardBody} from "reactstrap";
import Editor from "rich-markdown-editor";
import {useStore} from "./Store";
import {observer} from "mobx-react-lite";

export const Paper: FunctionComponent = observer(() => {
    const store = useStore();
    const note = store.selectedNote;

    return <Card className="my-4 mx-2 border-0 shadow" key={note?.id ?? ''}>
        <CardBody>
            <Editor
                onChange={getValue => store.updateSelectedNote(getValue())}
                defaultValue={note?.content}
                id="markdown-editor"
                className="ps-5"/>
        </CardBody>
    </Card>;
})