import React, {FunctionComponent, useState} from "react";
import {Button, ButtonGroup} from "reactstrap";
import classNames from "classnames";
import * as Icon from "react-bootstrap-icons";
import {useStore} from "../../Store+utils";


export const Header: FunctionComponent<{ content: string }> = ({content}) => {
    const [isConfirmingDelete, setConfirmingDelete] = useState(false);
    const store = useStore();
    const deleteNote = () => {
        setConfirmingDelete(false)
        store.deleteNote()
    }
    const confirmButtonClasses = classNames('d-inline-flex', 'align-items-center', {
        disabled: isConfirmingDelete
    })

    function download(extension: string) {
        const body = encodeURIComponent(content);
        const element = document.createElement('a');

        element.setAttribute('href', `data:text/plain;charset=utf-8,${body}`);
        element.setAttribute('download', `${content.split("\n", 1)[0]?.replace(/^\W*/, '') ?? "note"}.${extension}`);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return <div className="d-flex flex-row-reverse mt-2 align-items-center pe-2">
        <Button
            size={"sm"}
            color="secondary"
            onClick={() => download('md')}
            className="d-inline-flex align-items-center">
            <Icon.CloudDownload />
            <span>&nbsp;.md</span>
        </Button>
        <span className="p-1"/>
        <Button
            size={"sm"}
            color="secondary"
            onClick={() => download('txt')}
            className="d-inline-flex align-items-center">
            <Icon.CloudDownload/>
            <span>&nbsp;.txt</span>
        </Button>
        <span className="p-1"/>
        <Button
            color="danger"
            onClick={() => setConfirmingDelete(!isConfirmingDelete)}
            className={confirmButtonClasses}>
            <Icon.Trash2/>
        </Button>
        <span className="p-1"/>
        <span className={classNames({visible: isConfirmingDelete, invisible: !isConfirmingDelete})}>
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
            </span>
    </div>
}
