import React, {FunctionComponent} from "react";
import {Card, CardBody} from "reactstrap";
import Editor from "rich-markdown-editor";

export const Paper: FunctionComponent<{ title: string }> = ({title}) =>
    <Card className="my-4 mx-2 border-0 shadow">
        <CardBody>
            <Editor
                onChange={getValue => console.log(getValue())}
                defaultValue={`# ${title}`}
                id="markdown-editor"
                className="ps-5"/>
        </CardBody>
    </Card>