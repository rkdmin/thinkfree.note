import React from 'react';
import NoteEditor from "../editor/NoteEditor";
import NoteDataProvider from "../editor/context/NoteDataProvider";
import BlockReRenderProvider from "../editor/context/BlockReRenderContext";
import SaveButton from "../editor/SaveButton";
import {useParams} from "react-router-dom";


function NoteEditorContainer() {
    const {noteId} = useParams();
    return (
        <NoteDataProvider key={noteId} noteId={noteId}>
            <BlockReRenderProvider>
                {/* 에디터 */}
                <NoteEditor/>
                <SaveButton/>
            </BlockReRenderProvider>
        </NoteDataProvider>
    );
}

export default React.memo(NoteEditorContainer);