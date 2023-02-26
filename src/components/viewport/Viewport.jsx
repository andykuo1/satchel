import BackgroundGrid from '../../styles/BackgroundGrid.module.css';
import Container from '../../styles/Container.module.css';

/**
 * @param {object} props
 * @param {number} props.gridOffsetX
 * @param {number} props.gridOffsetY
 * @param {import('react').ReactNode} props.children
 * @param {object} [props.containerProps]
 */
export default function Viewport({
  gridOffsetX,
  gridOffsetY,
  children,
  containerProps = {},
}) {
  const {
    className: classNameContainer = {},
    style: styleContainer = {},
    ...propsContainer
  } = containerProps;
  return (
    <div
      className={[
        Container.containerFill,
        Container.overflowHidden,
        BackgroundGrid.backgroundGrid,
        classNameContainer,
      ].join(' ')}
      style={{
        '--grid-offset-x': `${gridOffsetX}px`,
        '--grid-offset-y': `${gridOffsetY}px`,
        ...styleContainer,
      }}
      {...propsContainer}>
      <div
        className={[
          Container.containerFill,
          BackgroundGrid.backgroundDotted,
        ].join(' ')}>
        {children}
      </div>
    </div>
  );
}
