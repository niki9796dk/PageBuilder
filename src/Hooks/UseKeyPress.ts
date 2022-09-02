import {useEffect, useState} from 'react';

interface KeyPress {
    key: string,
    ctrl?: boolean,
    shift?: boolean,
}

export default function useKeyPress(conditions : KeyPress|KeyPress[]) {
    const [targetKeysIsPressed, setTargetKeysIsPressed] = useState<number>(0);

    useEffect(() => {
        // Mount
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleKeyDown = (event: KeyboardEvent) => {
        setTargetKeysIsPressed(prevState => {
            for (const condition of getConditions()) {
                if (matchesCondition(event, condition)) {
                    return prevState + 1;
                }
            }

            return 0;
        });
    };

    const handleKeyUp = () => {
        setTargetKeysIsPressed(0);
    };

    const getConditions : () => KeyPress[] = () => {
        if (Array.isArray(conditions)) {
            return conditions;
        }

        return [conditions];
    };

    const matchesCondition = (event : KeyboardEvent, condition : KeyPress) => {
        if (event.key.toLowerCase() != condition.key) {
            return false;
        }

        if (condition.ctrl !== undefined && event.ctrlKey != condition.ctrl) {
            return false;
        }

        // noinspection RedundantIfStatementJS
        if (condition.shift !== undefined && event.shiftKey != condition.shift) {
            return false;
        }

        return true;
    };

    return targetKeysIsPressed;
}
