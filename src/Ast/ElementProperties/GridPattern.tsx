import './../Styles/reset.css'
import './../Styles/obsidian.css'
import './../Styles/style.css'
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import GridGap from "./GridGap";

interface GridPatternProps {
    gap: GridGap
    editorMode: boolean
    gridHeight: number
}

export default class GridPattern extends React.Component<GridPatternProps, any> {
    readonly id: string;

    constructor(props: GridPatternProps, context: any) {
        super(props, context);

        this.id = uuidv4();
    }

    render() {
        const cellHeight = 25 + this.props.gap.row;
        const cellWidth = 50 - ((this.props.gap.column * 23) / 24);

        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="grid-pattern" style={this.getSvgStyle()}>
                <defs>
                    <pattern id={this.getId()} patternUnits="userSpaceOnUse" height={`${cellHeight}px`} width={`${cellWidth + this.props.gap.column}px`}>
                        <rect x="0.5" y="0.5" rx="3" width={`${cellWidth-1}px`} height="24px" style={this.getRectStyle()}/>
                    </pattern>
                </defs>

                <rect width="100%" height="100%" fill={`url(#${this.getId()})`}></rect>
            </svg>
        );
    }

    getId(): string {
        return `grid-pattern-${this.id}`
    }

    getSvgStyle(): any {
        return {
            opacity: this.props.editorMode ? '100%' : '0%',
            position: 'relative',
            gridArea: `1 / 1 / ${this.props.gridHeight} / 25`,
            zIndex: 0,
        }
    }

    getRectStyle(): any {
        return {
            fill: 'gainsboro',
            stroke: 'gray',
            strokeWidth: 1,
            opacity: 0.3,
        }
    }
}
