import styles from "./ShowJSON.module.scss";

export function ShowJSON(props) {
  //   const data = props.children ?? undefined;
  return (
    <>
      {props.title && <div className={styles.title}>{props.title}</div>}
      <pre className={styles.body}>
        {JSON.stringify(props.children, null, 2)}
      </pre>
    </>
  );
}
