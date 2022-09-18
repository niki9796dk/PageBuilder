import GridGap, {GridGapAst} from './GridGap';
import React, {ForwardedRef, forwardRef, useState} from 'react';
import {AstNode} from '../../types';
import GridPattern from './GridPattern';

export interface GridNodeAst {
    type: string;
    gap: GridGapAst;
}

interface GridNodeProps extends AstNode<GridNodeAst> {
    gridHeight: number;
    children: JSX.Element[]
}

const GridNode = forwardRef((props: GridNodeProps, ref : ForwardedRef<HTMLDivElement>) => {
    const [gap] = useState(new GridGap(props.ast.gap));

    return (
        <div className="section-content" style={gap.getStyleMap()} ref={ref}>
            <GridPattern gap={gap} editorMode={props.editorMode} gridHeight={props.gridHeight}/>
            {props.children}
        </div>
    );
});

GridNode.displayName = 'GridNode';

export default GridNode;
