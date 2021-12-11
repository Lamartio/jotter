import React, {FunctionComponent, useState} from "react";
import {Button, ButtonGroup} from "reactstrap";
import classNames from "classnames";
import * as Icon from "react-bootstrap-icons";
import {useStore} from "../../Store+utils";


export const Header: FunctionComponent = () => {
    const [isConfirmingDelete, setConfirmingDelete] = useState(false);
    const store = useStore();
    const deleteNote = () => {
        setConfirmingDelete(false)
        store.deleteNote()
    }
    const confirmButtonClasses = classNames('d-inline-flex', 'align-items-center', {
        disabled: isConfirmingDelete
    })

    return <div className="d-flex flex-row-reverse mt-2 align-items-center pe-2">
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
