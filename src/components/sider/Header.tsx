import React, {FunctionComponent} from "react";
import {ListGroupItem} from "reactstrap";
import {Paddings} from "./utils";

export const Header: FunctionComponent<{ depth: number }> = ({depth, children}) =>
    <ListGroupItem disabled className="text-truncate fw-bold">
        <Paddings depth={depth}/>
        {children}
    </ListGroupItem>