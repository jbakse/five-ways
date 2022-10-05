export function Table({ columns, data }) {
  return (
    <table className="table content-block">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.field}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row) => (
          <tr key={row.id}>
            {columns.map((c) => (
              <td key={c.field}>
                {c.formatter ? c.formatter(row[c.field]) : row[c.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
