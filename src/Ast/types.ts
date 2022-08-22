import {BlockNodeProps} from './Elements/Blocks/PositionalBlock';

interface AST {
    toJson(): object
}

interface BlockFactoryList {
    [key: string]: (props: BlockNodeProps<any>) => JSX.Element;
}

export type {AST, BlockFactoryList};
