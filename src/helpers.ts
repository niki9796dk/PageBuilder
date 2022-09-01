export interface Offset {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export function getDocumentOffset(element: Element ): Offset {
    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        right: rect.right + window.scrollX,
    };
}

