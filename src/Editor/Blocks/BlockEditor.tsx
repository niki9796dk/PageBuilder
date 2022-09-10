import React, {ReactElement, useEffect, useState} from 'react';
import './BlockEditor.css';
import {DocumentNodeAst} from '../../Ast/Elements/DocumentNode';
import {defaultTextNodeAst} from '../../Ast/Elements/Blocks/TextNode';
import {BlockNodeAst} from '../../Ast/Elements/Blocks/PositionalBlock';
import {defaultImageNodeAst} from '../../Ast/Elements/Blocks/ImageNode';
import {defaultQuoteNodeAst} from '../../Ast/Elements/Blocks/QuoteNode';
import {defaultLineNodeAst} from '../../Ast/Elements/Blocks/LineNode';
import {defaultCodeNodeAst} from '../../Ast/Elements/Blocks/CodeNode';
import {defaultTextCarouselNodeAst} from '../../Ast/Elements/Blocks/TextCarouselNode';
import EditorItem from './../EditorItem';
import MouseTracker, {TrackedPosition} from './../MouseTracker';
import {useAppSelector} from '../../Store/hooks';
import {round} from 'lodash';
import {BlockFactory} from '../../Ast/BlockFactory';
import {Section} from '../../Store/Slices/SectionsSlice';

interface Props {
    style?: any,
    ast: DocumentNodeAst;
    astUpdater: (updatedAst: DocumentNodeAst, isPartial: boolean) => void;
    className?: string;
}

export default function BlockEditor(props: Props) {
    const [newBlock, setNewBlock] = useState<ReactElement | null>(null);
    const [trackedPosition, setTrackedPosition] = useState<TrackedPosition | null>(null);
    const {sections} = useAppSelector(state => state.sections);
    const [nodeToSpawn, setNodeToSpawn] = useState<BlockNodeAst>();
    // TODO: Do not hardcode grid size locally like this...
    const gridSize = {
        cellWidth: 1200 / 24,
        cellHeight: 25,
    };

    const spawnBlock = (nodeToSpawn: BlockNodeAst, event: React.MouseEvent) => {
        setNodeToSpawn(nodeToSpawn);

        const width = nodeToSpawn.position.width * gridSize.cellWidth;
        const height = nodeToSpawn.position.height * gridSize.cellHeight;

        setNewBlock(
            <MouseTracker spawnEvent={event} onMove={(position) => setTrackedPosition(position)}>
                <div style={{marginTop: `-${height/2}px`, marginLeft: `-${width/2}px`}}>
                    <div
                        children={BlockFactory.create(nodeToSpawn, 99, true, gridSize, () => {return;})}
                        className="opacity-75"
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                        }}
                    />
                </div>
            </MouseTracker>
        );
    };

    useEffect(() => {
        if (newBlock !== null) {
            // Mount
            document.addEventListener('dragend', despawnBlock);
            document.addEventListener('mouseup', despawnBlock);

            // Unmount
            return () => {
                document.removeEventListener('dragend', despawnBlock);
                document.removeEventListener('mouseup', despawnBlock);
            };
        }
    }, [sections, trackedPosition, newBlock]);

    const despawnBlock = () => {
        setNewBlock(null);
        setTrackedPosition(null);

        if (! trackedPosition || ! nodeToSpawn) {
            return;
        }

        function findRelevantSection(): Section|null {
            if (! trackedPosition) {
                return null;
            }

            let relevantSection : Section|null = null;
            const minDistance = Number.MAX_VALUE;

            for (const [, section] of Object.entries(sections)) {
                let distance = trackedPosition.top - section.top;

                // We do not care about negative distances
                // since this means our element is released above this section
                if (distance < -gridSize.cellHeight) {
                    continue;
                }

                distance = Math.abs(distance);

                // If this section is closer to our drop point,
                // then remember this section for later return
                if (distance < minDistance) {
                    relevantSection = section;
                }
            }

            return relevantSection;
        }

        const section = findRelevantSection();

        // Do nothing if no section is located
        if (section == null) {
            return;
        }

        const top = round(Math.max((trackedPosition.top - section.top) / gridSize.cellHeight, 0));
        const left = round(Math.max((trackedPosition.left - section.left) / gridSize.cellWidth, 0));

        // If outside of grid then do nothing
        if (
            trackedPosition.left < section.left ||
            left > 23
        ) {
            return;
        }

        nodeToSpawn.position = {...nodeToSpawn.position, left, top};
        props.ast.sections[section.index].blocks.push(nodeToSpawn);
        props.astUpdater(props.ast, false);
    };

    return (
        <>
            {newBlock}
            <div>
                <div className="element-group">
                    <div className="element-group-title">Textual</div>
                    <div className="element-group-items">
                        <EditorItem onMouseDown={(event) => spawnBlock(defaultTextNodeAst(), event)}>
                            <i className="fa-solid fa-font icon"/>
                            <span className="icon-text">Text</span>
                        </EditorItem>
                        <EditorItem onMouseDown={(event) => spawnBlock(defaultQuoteNodeAst(), event)}>
                            <i className="fa-solid fa-quote-left icon"/>
                            <span className="icon-text">Quote</span>
                        </EditorItem>
                        <EditorItem onMouseDown={(event) => spawnBlock(defaultCodeNodeAst(), event)}>
                            <i className="fa-solid fa-code icon"/>
                            <span className="icon-text">Code</span>
                        </EditorItem>
                        <EditorItem onMouseDown={(event) => spawnBlock(defaultTextCarouselNodeAst(), event)}>
                            <i className="fa-regular fa-keyboard icon"/>
                            <span className="icon-text">Text Carousel</span>
                        </EditorItem>
                    </div>
                </div>

                <div className="element-group">
                    <div className="element-group-title">Graphical</div>
                    <div className="element-group-items">
                        <EditorItem onMouseDown={(event) => spawnBlock(defaultImageNodeAst(), event)}>
                            <i className="fa-regular fa-image icon"/>
                            <span className="icon-text">Image</span>
                        </EditorItem>
                        <EditorItem onMouseDown={(event) => spawnBlock(defaultLineNodeAst(), event)}>
                            <i className="fa-regular fa-window-minimize icon" style={{position: 'relative', top: '-33%'}}/>
                            <span className="icon-text">Line</span>
                        </EditorItem>
                    </div>
                </div>
            </div>
        </>
    );
}
