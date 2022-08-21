import {AST} from '../types';

export default class GridGap implements AST{
    public type: string;
    public subType: string;
    public column: number;
    public row: number;

    constructor(element: any) {
        this.type = element.type;
        this.subType = element.subType;
        this.column = Number.parseInt(element.column);
        this.row = Number.parseInt(element.row);
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
