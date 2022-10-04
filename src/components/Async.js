export function Async(props) {
  if (props.data.loading) {
    return <div className="content-block">Loading...</div>;
  }
  if (props.data.error) {
    return (
      <div className="content-block">Error: {props.data.error.message}</div>
    );
  }
  return <div>{props.children}</div>;
}
