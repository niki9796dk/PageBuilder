import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {useEffect, useMemo, useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './TextCarouselNode.css';
import React from 'react';
import {clamp} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import useEditor from '../../../Hooks/UseEditor';

export interface TextCarouselNodeAst extends BlockNodeAst{
    staticText: string;
    dynamicText: Array<string>;
    staticColor: string;
    dynamicColor: string;
    time: number;
}

export default function TextCarouselNode(props: BlockNodeProps<TextCarouselNodeAst>) {
    const editor = useEditor(props);
    const style = new StyleMap(props.ast.style);

    const dynamicTexts = useMemo(() => props.ast.dynamicText.map(value => value.trim()).filter(value => value !== ''), [props.ast.dynamicText]);
    const [textIndex, setTextIndex] = useState(0);
    const [typedTextLength, setTypedTextLength] = useState(0);
    const [typingDirection, setTypingDirection] = useState(1);

    useEffect(() => {
        if (Number.isNaN(textIndex) || textIndex >= dynamicTexts.length) {
            setTextIndex(0);
            setTypedTextLength(0);
            setTypingDirection(1);
        }
    }, [dynamicTexts, textIndex]);

    useEffect(() => {
        const totalLength = dynamicTexts[textIndex]?.length ?? 0;
        const isTyping = 0 <= typedTextLength && typedTextLength <= totalLength;

        function typeNextChar() {
            const timeout = setTimeout(() => {
                setTypedTextLength(typedTextLength + typingDirection);
            }, Math.max(props.ast.time - (typedTextLength * 15), 50));

            return () => clearTimeout(timeout);
        }

        function reverseTypingOrder() {
            const timeout = setTimeout(() => {
                setTypingDirection(-typingDirection);
                setTypedTextLength(clamp(typedTextLength, 0, totalLength));
            }, typingDirection > 0 ? 1000 : 100);

            return () => clearTimeout(timeout);
        }

        function updateWord() {
            setTextIndex((textIndex + 1) % dynamicTexts.length);
        }

        if (Number.isNaN(textIndex)) {
            setTextIndex(0);

            return typeNextChar();
        }

        if (totalLength == 0) {
            updateWord();

            return typeNextChar();
        }

        if (isTyping) {
            return typeNextChar();
        } else {
            if (typedTextLength <= 0) {
                updateWord();
            }

            return reverseTypingOrder();
        }
    }, [typedTextLength, dynamicTexts]);

    return (
        <PositionalBlock {...props} {...editor}>
            <div className="node-text-carousel" style={style.getStyleMap()}>
                <span className="static-text" style={{color: props.ast.staticColor}}>{props.ast.staticText}</span>
                <span className="dynamic-text" style={{color: props.ast.dynamicColor, borderColor: props.ast.dynamicColor}}>{dynamicTexts[textIndex]?.substring(0, typedTextLength) ?? ''}</span>
            </div>
        </PositionalBlock>
    );
}

export function defaultTextCarouselNodeAst(): TextCarouselNodeAst {
    return {
        'id': uuidv4(),
        'type': 'block',
        'subType': 'textCarousel',
        'staticText': 'I\'m a',
        'staticColor': '#000000',
        'dynamicColor': '#008000',
        'dynamicText': ['Youtuber', 'Designer', 'Developer', 'Freelancer'],
        'time': 150,
        'style': {
            'font-size': '2em'
        },
        'position': {
            'height': 2,
            'width': 7,
            'left': 0,
            'top': 0
        }
    };
}
