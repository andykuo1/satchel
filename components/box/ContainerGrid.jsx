import styles from './ContainerGrid.module.css';

/**
 * 
 * @param {object} props
 * @param {string} [props.title]
 * @param {object} [props.containerProps]
 * @param {import('react').ReactNode} [props.children]
 */
export default function ContainerGrid({ title = '', containerProps = {}, children = undefined }) {
    const { className: classNameContainer = '', ...propsContainer } = containerProps;
    return (
        <fieldset className={`${styles.container} ${styles.subgrid} ${classNameContainer}`} {...propsContainer}>
            <legend className={styles.title}>{title}</legend>
            {children}
        </fieldset>
    );
}
