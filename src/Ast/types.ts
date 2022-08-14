import {ComponentClass} from "react";
import {BlockNodeProps} from "./Elements/BlockNode";

interface AST {
    toJson(): object
}

interface BlockFactoryList {
    [key: string]: ComponentClass<BlockNodeProps<any>, any>;
}

export type {AST, BlockFactoryList};
