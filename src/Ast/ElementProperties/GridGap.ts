import {AST} from '../types';

export interface GridGapAst {
    type: string;
    subType: string;
    column: number;
    row: number;
}

export default class GridGap implements AST {
    public type: string;
    public subType: string;
    public column: number;
    public row: number;

    constructor(element: GridGapAst) {
        this.type = element.type;
        this.subType = element.subType;
        this.column = Number.parseInt(element.column.toString());
        this.row = Number.parseInt(element.row.toString());
    }

    public toJson(): object {
        return {
            type: this.type,
            subType: this.subType,
            column: this.column,
            row: this.row,
        };
    }

    getStyleMap(): any {
        return {
            gap: `${this.row}px ${this.column}px`,
        };
    }
}
