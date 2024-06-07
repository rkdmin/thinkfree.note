import React, {createContext, useRef} from 'react';
import NoteBlockSwitcher from "./NoteBlockSwitcher";
import useEditHandler from "./hooks/useEditHandler";
import useBlockIdList from "./hooks/useBlockIdList";
import Title from "./Title";

export const EditorContext = createContext(null);

function NoteEditor() {
    const {blockIdList} = useBlockIdList();
    const {onKeyDownHandler} = useEditHandler();
    // 하위 컴포넌트에서 에디터에 핸들러 등록하기 위한 ref
    const editorRef = useRef(null);

    return (
        <EditorContext.Provider value={editorRef}>
            <div className="editor" spellCheck={false} ref={editorRef} onKeyDown={onKeyDownHandler}
                 contentEditable={true}
                 suppressContentEditableWarning={true}>
                <Title/>
                {blockIdList.map(blockId => <NoteBlockSwitcher key={blockId} blockId={blockId}/>)}
            </div>
        </EditorContext.Provider>
    );
}

export default NoteEditor;