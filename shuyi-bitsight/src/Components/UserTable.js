import styled from "styled-components";
import Followers from "./Follower";

export default function UserTable(props) {

  const data = props.data
  
  function getTableHeader() {
    return (
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Login</th>
        <th>Avater</th>
        <th># Followers</th>
      </tr>
    )
  }

  return (
      <>
      <table>
        <tbody>
          {getTableHeader()}

          {Object.entries(data).map(([key, user]) => {
           
            return(
              <tr key={user.id}>
                <td>{parseInt(key)+1}</td>
                <td><h3>{user.id}</h3></td>
                <td><a href={user.html_url}>{user.login}</a></td>
                <td><Logo src={user.avatar_url} /></td>
                <td><Followers data={user} /></td>
              </tr>
            )
          })
          }
      
        </tbody>
      </table>
      </>
  );

}


const Logo = styled.img`
  
  width: 40px;
  height: 40px;
  margin-left: 5px;

  display: inline-block;
  
 
`; 
