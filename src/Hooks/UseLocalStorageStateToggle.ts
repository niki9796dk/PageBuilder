import {useState} from 'react';

export default function useLocalStorageStateToggle(key: string, initialState: boolean): [boolean, () => void] {
    const [state, setState] = useState(localStorage.getItem(key) ?? (initialState ? '1' : ''));

    return [
        !!state,
        () => {
            const value = state ? '' : '1';

            setState(value);
            localStorage.setItem(key, value);
        }
    ];
}
