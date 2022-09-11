import {MutableRefObject, useEffect} from 'react';

export default function useDisableWheel(elementReference : MutableRefObject<HTMLElement|null>) {
    useEffect(() => {
        if (! elementReference.current) {
            return;
        }

        const current = elementReference.current as HTMLInputElement;

        const listener = (event : Event) => {
            event.stopPropagation();
        };

        current.addEventListener('wheel', listener, {passive: false});

        return () => current.removeEventListener('wheel', listener);
    }, [elementReference]);
}
