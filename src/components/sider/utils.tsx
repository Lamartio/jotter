import {arrayOf, ChildlessFunctionComponent} from "../../utils";
import React from "react";

export const Paddings: ChildlessFunctionComponent<{ depth: number }> = ({depth}: { depth: number }) =>
    <span className="invisible">
        {arrayOf(depth).fill('—').join('')}
    </span>