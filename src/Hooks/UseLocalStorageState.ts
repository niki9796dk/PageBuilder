import {useState} from 'react';

export default function useLocalStorageState(key: string, initialState: string): [string, (newState: string) => void] {
    const [state, setState] = useState(localStorage.getItem(key) ?? initialState);

    return [
        state,
        (newState) => {
            setState(newState);
            localStorage.setItem(key, newState);
        }
    ];
}
