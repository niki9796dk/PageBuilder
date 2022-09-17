import React, {ChangeEvent, useMemo} from 'react';

type OptionType = string|number;

interface Entry<T extends OptionType> {
    value: T,
    label: string,
}

interface Props<T extends OptionType> {
    value: T;
    options: Array<Entry<T>>;
    onChange: (entry: Entry<T>|undefined) => void;
}

export default function EditorSelect<T extends OptionType>(props: Props<T>) {
    const options = useMemo(() => {
        return props.options.map(entry => {
            return <option key={entry.value} value={entry.value}>{entry.label}</option>;
        });
    }, [props.options]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const entry = props.options.find(entry => entry.value == value);

        props.onChange(entry);
    };

    return (
        <select onChange={handleChange} value={props.value}>
            {options}
        </select>
    );
}
