export default function RepoTable(props) {

  const data = props.data
  
  function getTableHeader() {
    return (
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Name</th>
        <th>Stars</th>
        <th>Description</th>
        <th>Created at</th>
      </tr>
    ) 
  }
 
  return (
      <>
      <table>
        <tbody>
          {getTableHeader()}
          {  Object.entries(data).map(([key, value]) => {
              return(
              <tr key={value.id}>
                <td>{parseInt(key)+1}</td>
                <td><h3>{value.id}</h3></td>
                  <td><a href={ value.html_url}>{value.name}</a></td>
                  <td>{ value.stargazers_count}</td>
                  <td>{value.description}</td>
                  <td>{ value.created_at}</td>
              </tr>
            )
             })
          }
      
        </tbody>
      </table>
      </>
  );
}

