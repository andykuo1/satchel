import styles from '../styles/Playground.module.css';
import GridView from './GridView';

export default function Playground({ className = '', gridOffsetX = 0, gridOffsetY = 0, viewIds = [], backgroundProps = {} }) {
  return (
    <div className={styles.view + ' ' + styles.grid + ' ' + className}
      style={{
        '--grid-offset-x': `${gridOffsetX}px`,
        '--grid-offset-y': `${gridOffsetY}px`,
      }}>
      <div className={styles.background} {...backgroundProps}>
      </div>
      {viewIds.map(viewId => <GridView key={viewId} viewId={viewId}/>)}
    </div>
  );
}
