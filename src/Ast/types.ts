import {BlockNodeProps} from "./Elements/BlockNode";

interface AST {
    toJson(): object
}

interface BlockFactoryList {
    [key: string]: (props: BlockNodeProps<any>) => JSX.Element;
}

export type {AST, BlockFactoryList};
