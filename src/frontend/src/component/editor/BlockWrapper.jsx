import React, {useRef} from 'react';
import {editorSelection} from "../../App";
import BlockManagerProvider from "./BlockManagerProvider";
import BlockMenuBox from "./block/BlockMenuBox";
import BlockReRender from "./BlockReRender";
import {useInitBlockCursor} from "../context/SelectionManagerProvider";
import {useDragOverBlockId} from "./context/DragAndDropProvider";
import BlockDragPoint from "./block/BlockDragPoint";

/**
 * 블록 공통 기능 구현 목적
 * @param id 블록 아이디
 * @param children
 * @param type
 * @returns {JSX.Element}
 */
function BlockWrapper({id, children, type}) {
    const wrapper = useRef(null);
    const dragOverBlockId = useDragOverBlockId();
    const isDragOver = dragOverBlockId === id;

    useInitBlockCursor(id);
    return (
        <BlockManagerProvider id={id}>
            <div
                 className={`block-wrapper ${isDragOver ? "isDragOver" : ""}`} ref={wrapper} data-block-id={id}
                 data-block-type={type}>
                <BlockMenuBox/>
                {children}
                <BlockReRender/>
                {isDragOver && <BlockDragPoint/>}
            </div>
        </BlockManagerProvider>
    );
}


export default BlockWrapper;