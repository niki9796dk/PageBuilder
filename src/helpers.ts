export interface Offset {
    top: number;
    left: number;
    bottom: number;
    right: number;
    height: number;
    width: number;
}

export function getDocumentOffset(element: Element ): Offset {
    const rect = element.getBoundingClientRect();

    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    const bottom = rect.bottom + window.scrollY;
    const right = rect.right + window.scrollX;

    return {
        top,
        left,
        bottom,
        right,
        width: right - left,
        height: bottom - top,
    };
}

interface StringKeyedObjects {
    [keys: string] : any
}

export function mergeObjects<TObject extends StringKeyedObjects, TSource extends StringKeyedObjects>(object: TObject, source: TSource): TObject & TSource {
    const keys = new Set(Object.keys(object).concat(Object.keys(source)));

    return [...keys].reduce((result, key) => {
        const objectValue = object[key];
        const sourceValue = source[key];

        if (isObject(objectValue) && isObject(sourceValue)) {
            result[key] = mergeObjects(objectValue, sourceValue);
        } else {
            result[key] = Object.hasOwn(source, key) ? sourceValue : objectValue;
        }

        return result;
    }, {} as StringKeyedObjects) as (TObject & TSource);
}

function isObject(value : any): boolean {
    return typeof value === 'object'
        && !Array.isArray(value)
        && value !== null;
}
