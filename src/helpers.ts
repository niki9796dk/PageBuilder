export interface Offset {
    top: number;
    left: number;
}

export function getOffset( element: any ): Offset {
    let x = 0;
    let y = 0;

    while( element && !isNaN( element.offsetLeft ) && !isNaN( element.offsetTop ) ) {
        x += element.offsetLeft - element.scrollLeft;
        y += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
    }

    return { top: y, left: x };
}

