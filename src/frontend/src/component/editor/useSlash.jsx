import React, {useEffect, useState} from 'react';
import {ContextMenu} from "../common/ContextMenu";
import {useMenu} from "../common/MenuContext";
import {editorSelection} from "../../App";
import useBlockIdList from "./hooks/useBlockIdList";
import {useBlockStore} from "./hooks/useBlockHooks";
import {ReactComponent as TextBlockIcon} from "../../assets/icon_textBlock.svg";
import {ReactComponent as UnorderedIcon} from "../../assets/icon_unorderedList.svg";
import {ReactComponent as TableIcon} from "../../assets/icon_table.svg";
import {TextBlock} from "../../model/TextBlock";

/**
 * @desc 슬래시로 블록 추가하는 컴포넌트 훅
 * @param editorRef 슬래시를 인식할 에디터
 * @returns {{slashComponent: (false|JSX.Element)}} 메뉴 오픈 시 슬래시 메뉴 반환
 */
function useSlash(editorRef) {
    const {openMenu, isOpen, closeMenu} = useMenu();
    const blockStore = useBlockStore();

    useEffect(() => {
        if (!editorRef.current) return;
        const $editor = editorRef.current;

        const slashHandler = (e) => {
            const block = blockStore.getBlock(editorSelection.blockId[0]);
            if(block instanceof TextBlock && e.data === "/") {
                if(editorSelection.getClosestElement("block").start.textContent.length === 1) {
                    const {right, bottom} = editorSelection.getBoundingRect();
                    openMenu(right, bottom)
                }
            }
            else {
                closeMenu();
            }
        }

        $editor.addEventListener("input", slashHandler);

        return () => {
            $editor.removeEventListener("input", slashHandler);
        }

    }, []);

    return {slashComponent : isOpen && <SlashMenu closeMenu={closeMenu} editorRef={editorRef}/>}
}


const SLASH_ITEM_TYPES = [["텍스트블록", "text", <TextBlockIcon/>], ["목록", "ul", <UnorderedIcon/>],["순서 목록", "ol", <UnorderedIcon/>], ["표", "table",
    <TableIcon/>]];

/**
 * @desc ContextMenu 기반의 슬래시 메뉴
 * @param closeMenu
 * @param editorRef
 * @returns {JSX.Element}
 * @constructor
 */
function SlashMenu({closeMenu, editorRef}) {
    const [menuIndex, setMenuIndex] = useState(0);
    const {replaceBlock} = useBlockIdList();
    const blockStore = useBlockStore();

    const replaceNewBlock = (type) => {
        closeMenu();
        replaceBlock(editorSelection.blockId[0], blockStore.createBlock(type).id);
    }

    useEffect(() => {
        if (!editorRef.current) return;
        const $editor = editorRef.current;


        const keyDownHandler = (e) => {
            if (e.key === "Escape") {
                closeMenu();
            }
            if (e.key === "Enter") {
                e.preventDefault();
                if (menuIndex <= 0) return
                replaceNewBlock(SLASH_ITEM_TYPES[menuIndex - 1][1]);
                e.stopPropagation();
            }
            if (e.key.startsWith("Arrow")) {
                e.preventDefault();
                if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    setMenuIndex(prev => prev === SLASH_ITEM_TYPES.length ? prev : prev + 1);
                } else {
                    setMenuIndex(prev => prev === 0 ? prev : prev - 1);
                }
            }
        }

        $editor.addEventListener("keydown", keyDownHandler);

        return () => {
            $editor.removeEventListener("keydown", keyDownHandler);
        }

    }, [menuIndex]);

    return <ContextMenu closeMenu={closeMenu}>
        <ContextMenu.SubTitle text="기본 Blocks"/>
        <ContextMenu.Divider/>
        {SLASH_ITEM_TYPES.map((item, idx) => {
            const [text, type, icon] = item;
            return <ContextMenu.Plain key={idx} isSelected={menuIndex === idx + 1} handler={() => replaceNewBlock(type)}
                                      name={text} icon={icon}/>
        })}
    </ContextMenu>
}

export default useSlash;