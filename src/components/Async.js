export function Async(props) {
  if (props.data.loading) {
    return <div>Loading...</div>;
  }
  if (props.data.error) {
    <div>Error: {props.data.error.message}</div>;
  }
  return <div>{props.children}</div>;
}
