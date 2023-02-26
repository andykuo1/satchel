import Styles from './ContainerHandles.module.css';

/**
 * @param {object} props
 * @param {boolean} [props.left]
 * @param {boolean} [props.right]
 * @param {boolean} [props.top]
 * @param {boolean} [props.bottom]
 * @param {object} [props.handleProps]
 */
export default function ContainerHandles({
  left = false,
  right = true,
  top = false,
  bottom = true,
  handleProps = {},
}) {
  const { className: classNameHandle = '', ...propsHandle } = handleProps;
  return (
    <>
      {top && (
        <button
          className={`${Styles.handlebar} ${Styles.topbar} ${classNameHandle}}`}
          {...propsHandle}></button>
      )}
      {left && (
        <button
          className={`${Styles.handlebar} ${Styles.leftbar} ${classNameHandle}`}
          {...propsHandle}></button>
      )}
      {right && (
        <button
          className={`${Styles.handlebar} ${Styles.rightbar} ${classNameHandle}`}
          {...propsHandle}></button>
      )}
      {bottom && (
        <button
          className={`${Styles.handlebar} ${Styles.bottombar} ${classNameHandle}`}
          {...propsHandle}></button>
      )}
    </>
  );
}
