import Styles from './IconButton.module.css';

/**
 * @param {object} props
 * @param {import('react').FC<import('react').SVGAttributes<SVGElement>>} props.Icon
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {import('react').MouseEventHandler} [props.onClick]
 */
export default function IconButton({ className, Icon, ...props }) {
    return (
        <button className={`${Styles.container} ${className}`} {...props}>
            <Icon viewBox="0 0 48 48"/>
        </button>
    );
}
