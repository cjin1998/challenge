import { useEffect, useState } from "react";
import styled from "styled-components";
import { Octokit } from "octokit";
import Spinner from '../spinner.gif'

export default function Followers(props) {

    const octokit = new Octokit();

    const data = props.data

    const [followers, setFollowers] = useState(false)
    const [is_loading, setIs_loading] = useState(false)

    const MINUTE_MS = 120000;

    //get followers on load
    useEffect(() => {
         
        getFollowerCt()

    }, [])
    
    //get followers every two minutes
    useEffect(() => {
    const interval = setInterval(() => {
        getFollowerCt()
    }, MINUTE_MS);

    return () => clearInterval(interval);
    }, [])

    
    async function getFollowerCt() {

        setIs_loading(true)

        try {
            const response = await octokit.request('GET /users/{username}', {
                        username: data.login
               })
             
            setFollowers(response.data.followers)

            setIs_loading(false)
 
      }catch (error) {
          console.log("error", error);
      }

    }
  
    return (
           <>
            {(!is_loading && followers)? <h3>{followers}</h3>: <Logo src={Spinner} alt="spinner"/>  }
            </>
    );

}

const Logo = styled.img`
  
  width: 20px;
  height: 20px;
  margin-left: 5px;

  display: inline-block;
  
 
`; 
