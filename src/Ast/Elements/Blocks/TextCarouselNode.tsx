import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {useEffect, useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './TextCarouselNode.css';
import React from 'react';
import {clamp} from 'lodash';
import {v4 as uuidv4} from 'uuid';

interface TextCarouselNodeAst extends BlockNodeAst{
    staticText: string;
    dynamicText: Array<string>;
    staticColor: string;
    dynamicColor: string;
    time: number;
}

export default function TextCarouselNode(props: BlockNodeProps<TextCarouselNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [staticText] = useState(props.ast.staticText);
    const [dynamicText] = useState(props.ast.dynamicText);
    const [staticColor] = useState(props.ast.staticColor);
    const [dynamicColor] = useState(props.ast.dynamicColor);
    const [time] = useState(props.ast.time);

    const [textIndex, setTextIndex] = useState(0);
    const [typedTextLength, setTypedTextLength] = useState(0);
    const [typingDirection, setTypingDirection] = useState(1);

    useEffect(() => {
        const totalLength = dynamicText[textIndex].length;
        const isTyping = 0 <= typedTextLength && typedTextLength <= totalLength;

        function typeNextChar() {
            const timeout = setTimeout(() => {
                setTypedTextLength(typedTextLength + typingDirection);
            }, Math.max(time - (typedTextLength * 15), 50));

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
            setTextIndex((textIndex + 1) % dynamicText.length);
        }

        if (isTyping) {
            return typeNextChar();
        } else {
            if (typedTextLength <= 0) {
                updateWord();
            }

            return reverseTypingOrder();
        }
    }, [typedTextLength]);

    return (
        <PositionalBlock {...props}>
            <div className="node-text-carousel" style={style.getStyleMap()}>
                <span className="static-text" style={{color: staticColor}}>{staticText}</span>
                <span className="dynamic-text" style={{color: dynamicColor, borderColor: dynamicColor}}>{dynamicText[textIndex].substring(0, typedTextLength)}</span>
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
        'staticColor': 'black',
        'dynamicColor': 'green',
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
