import {DocumentNodeAst} from './Ast/Elements/DocumentNode';
import {clamp, cloneDeep} from 'lodash';

export default class EditHistory {
    protected currentIndex = 0;
    protected history: DocumentNodeAst[] = [];

    constructor(initial: DocumentNodeAst) {
        this.history.push(initial);
    }

    /**
     * Pushes a change to the front of the history,
     * and disregards any previously reverted changes,
     *
     * @param {DocumentNodeAst} ast
     *
     * @returns {DocumentNodeAst}
     */
    public pushChange(ast: DocumentNodeAst): DocumentNodeAst {
        // Remove any changes that we have previously reverted
        // that was kept in memory in case the user
        // would change their mind about reverting a change.
        this.history.splice(this.currentIndex + 1);
        this.history.push(cloneDeep(ast));

        // Set current index to the latest element
        this.currentIndex = this.history.length - 1;

        return ast;
    }

    /**
     * Goes one step back in the edit history and returns the state
     *
     * @returns {DocumentNodeAst}
     */
    public goBack(): DocumentNodeAst {
        this.updateCurrentIndexBy(-1);

        return this.getCurrent();
    }

    /**
     * Goes one step forward in the edit history and returns the state
     *
     * @returns {DocumentNodeAst}
     */
    public goForward(): DocumentNodeAst {
        this.updateCurrentIndexBy(1);

        return this.getCurrent();
    }

    /**
     * Changes the current index by the given amount, while clamping the value to a valid range
     *
     * @param amount
     * @private
     */
    private updateCurrentIndexBy(amount : number) {
        this.currentIndex = clamp(this.currentIndex + amount, 0, this.history.length - 1);
    }

    /**
     * Returns the current active element in the history
     */
    public getCurrent(): DocumentNodeAst {
        return this.history[this.currentIndex];
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }
}
