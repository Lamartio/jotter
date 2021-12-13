import React, {FunctionComponent} from "react";
import {ListGroupItem} from "reactstrap";
import {Paddings} from "./utils";
import {Leaf} from "../../models/Tree";

type RowProps = { leaf: Leaf, isSelected: boolean, select: () => void }

export const Row: FunctionComponent<RowProps> = ({leaf, isSelected, select, children}) =>
    <ListGroupItem
        action
        active={isSelected}
        tag="button"
        onClick={select}
    >
        <Paddings depth={leaf.depth}/>
        {children}
    </ListGroupItem>