import React, {FunctionComponent} from "react";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";
import MarkdownEditor from "rich-markdown-editor";
import {observer} from "mobx-react-lite";
import './Paper.css';
import {useStore} from "../../Store+utils";
import {Header} from "./Header";
import {Note} from "../../models/Note";


type PaperProps = {
    note: Note,
    onChange: (content: string) => void
};

const Paper: FunctionComponent<PaperProps> =
    ({note, onChange}) => {

        function handleChange(getValue: () => string | undefined) {
            try {
                const value = getValue()

                if (value)
                    onChange(value)
            } catch (e) {
                console.error(e)
            }
        }

        return <div className="h-100 overflow-auto">
            <Header content={note.content}/>
            <Card className="m-2 border-0 shadow">
                <CardBody>
                    <MarkdownEditor
                        key={note.id}
                        onChange={handleChange}
                        defaultValue={note.content}
                        id="markdown-editor"
                        className="ps-5"/>
                </CardBody>
            </Card>
        </div>;
    }

const EmptyEditor: FunctionComponent<{ addNote: () => void }> = ({addNote}) =>
    <div className="d-flex align-items-center justify-content-center h-100">
        <Card className="w-75">
            <CardBody>
                <CardTitle tag="h5">
                    No notes yet
                </CardTitle>
                <CardText>
                    It seems that you don't have any notes yet, or you forgot to select one.
                </CardText>
                <Button className="float-end" onClick={addNote}>Add one now</Button>
            </CardBody>
        </Card>
    </div>

export const Editor: FunctionComponent = observer(() => {
        const store = useStore()
        const selectedNote = store.tree.current?.selected

        return selectedNote
            ? <Paper note={selectedNote} onChange={value => store.updateNote(value)}/>
            : <EmptyEditor addNote={() => store.addNote()}/>
    }
)