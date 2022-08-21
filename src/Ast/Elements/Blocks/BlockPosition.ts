export default class BlockPosition {
    public left: number;
    public top: number;
    public width: number;
    public height: number;

    constructor(element: any) {
        this.left = element.left;
        this.top = element.top;
        this.width = element.width;
        this.height = element.height;
    }

    public getStyleMap(): any {
        return {
            gridArea: `${this.top+1} / ${this.left+1} / ${this.top + this.height+1} / ${this.left + this.width+1}`,
        };
    }

    public toJson(): object {
        return {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height,
        };
    }
}
