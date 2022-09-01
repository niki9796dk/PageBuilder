function subscribe(element: Element, eventName: string, listener: EventListenerOrEventListenerObject) {
    element.addEventListener(eventName, listener);
}

function unsubscribe(element: Element, eventName: string, listener: EventListenerOrEventListenerObject) {
    element.removeEventListener(eventName, listener);
}

function publish(element: Element, eventName: string, data: any) {
    element.dispatchEvent(new CustomEvent(eventName, {detail: data, bubbles: true}));
}

export { publish, subscribe, unsubscribe};
