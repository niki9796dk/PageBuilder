import * as _ from 'lodash';
import {camelCase} from 'change-case';

export default class StyleMap {
    private readonly styles: any;
    private readonly shadowStyles: any;

    constructor(styles: any) {
        this.styles = styles;
        this.shadowStyles = {};
    }

    public getStyle(): string {
        const styles = _.map(this.styles, (value, key) => `${key}: ${value}`).join('; ');
        const shadowStyles = _.map(this.shadowStyles, (value, key) => `${key}: ${value}`).join('; ');

        return styles + ';' + shadowStyles;
    }

    public getStyleMap(): any {
        const styles: any = {};

        _.each(this.styles, (value, key) => styles[camelCase(key)] = value);
        _.each(this.shadowStyles, (value, key) => styles[camelCase(key)] = value);

        return styles;
    }

    public toJson(): object {
        return this.styles;
    }

    public shadowStyleSet(key: string, value: string): void {
        this.shadowStyles[key] = value;
    }
}
