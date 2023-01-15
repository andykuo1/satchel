import ContainerBox from '../box/ContainerBox';
import { handleMouseDownCallback } from '../cursor/CursorCallback';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').View} View
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {import('react').ReactNode} props.children
 */
export default function BaseBox({ store, view, children }) {
    function onHandleMouseDown(e) {
        return handleMouseDownCallback(e, store, view);
    }
    return (
        <ContainerBox
            x={view.coordX} y={view.coordY}
            w={view.width} h={view.height}
            handleProps={{ onMouseDown: onHandleMouseDown }}>
            {children}
        </ContainerBox>
    );
}
