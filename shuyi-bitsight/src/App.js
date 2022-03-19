import styled from "styled-components";
import { Octokit } from "octokit";
import { format, lastDayOfMonth } from "date-fns"
import { useEffect, useReducer } from "react";
import Spinner from './spinner.gif'

import RepoTable from "./Components/RepoTable";
import UserTable from "./Components/UserTable";


export default function App() {

  //functions to get the date range of 
  //last month and last year from the current date
  //for the search query

  const today = new Date();
  const DATE_FORMAT ='yyyy-MM-dd';

  function getLastMonthDateRange() {
    
    const prevMonth = today.getMonth() - 1;
    const firstDay = 1;

    const firstDayLastMonth = new Date(today.getFullYear(), prevMonth, firstDay);
    const lastDayLastMonth = lastDayOfMonth(firstDayLastMonth)

    return format(firstDayLastMonth, DATE_FORMAT)+".."+format(lastDayLastMonth, DATE_FORMAT)
  }

  function getLastYearDateRange(){

    const prevYear = today.getFullYear() - 1;

    return prevYear+"-01-01.."+prevYear+"-12-31"
    
  }




  //initialize reducer function
  function pageReducer(pageState, action) {
        switch (action.type) {
            case 'UPDATE': return { ...pageState, ...action.param };    
            default: return pageState;
        }
  }
  
  const initialState = {

    isLoadingRepos: false,
    isLoadingUsers: false,
    hot_repos: [],
    prolific_users: []
    
  }

  const [pageState, dispatch] = useReducer(pageReducer, initialState);
  
  

//intialize request
  const octokit = new Octokit({ auth: `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` });

  //function to refresh Repository
  async function refreshRepos() {

    dispatch({ type: 'UPDATE', param: {isLoadingRepos: true}}); 
 
    try {
          const repoData = []
          const response = await octokit.request('GET /search/repositories', {
            q: 'created:'+getLastMonthDateRange(),
            sort: 'stars',
            order: 'desc',
            
          })
      
                          
       for (let i = 0; i < 5; i++){
        repoData.push(response.data.items[i])
      }

      dispatch({ type: 'UPDATE',param:{hot_repos: repoData, isLoadingRepos: false}}); 
     
      }catch (error) {
          console.log("error", error);
      }
    
  }

 //function to refresh Users
  async function refreshUsers() {
     
    dispatch({ type: 'UPDATE', param: {isLoadingUsers: true}}); 
 
    try {
          const userData = []
          const response = await octokit.request('GET /search/users', {
            q: 'created:'+getLastYearDateRange(),
            sort: 'followers',
            order: 'desc',
            
          })
            
      for (let i = 0; i < 5; i++){
        userData.push(response.data.items[i])
      } 

      dispatch({ type: 'UPDATE',param:{prolific_users: userData, isLoadingUsers: false}}); 
     
      }catch (error) {
          console.log("error", error);
      }
    
   }
  
  
  //calls to refresh Repo and Users when the page first loads
  useEffect(() => {
     
    refreshRepos();      
    refreshUsers();
        
  }, []);


  return (
    <Content> 
      <Section>
        <Title>Top 5 Repos with the most stars created last month: </Title>

        <button className="updateButton" id="hot_repo" onClick={() => refreshRepos()}>Refresh Repos</button>
        
        {(!pageState.isLoadingRepos && pageState.hot_repos.length > 0) ?
          <RepoTable data={pageState.hot_repos} /> :
          <Loader>
            <h3>Loading Repos...</h3>
            <img src={ Spinner} alt="spinner"/>
          </Loader>
        }
     
      </Section>
     
      <Section>
        <Title>Top 5 Users with the most followers created last year: </Title>

        <button className="updateButton" id="prolific_users" onClick={() => refreshUsers()}>Refresh Users</button>
        
        {(!pageState.isLoadingUsers && pageState.prolific_users.length > 0) ?
        <UserTable data={pageState.prolific_users} /> :
          <Loader>
            <h3>Loading Users...</h3>
              <img src={ Spinner} alt="spinner"/>
          </Loader>} 
      
      </Section>
  </Content>
  );
}


const Content = styled.div`
  margin: auto;
  max-width: 1240px;

`;

const Loader = styled.div`
 
  margin: auto;
  max-width: 400px;
 
  text-align: center;

  padding-top: 50px;
  padding-bottom: 100px;

`;


const Section = styled.div`
  box-shadow: 0 -1px 4px 0 rgba(25, 32, 36, 0.04),
    0 3px 6px 0 rgba(25, 32, 36, 0.16);

  margin-bottom: 30px;
  padding: 5px 20px 20px 20px;

`;

const Title = styled.h1`
  
  font-size: 30px;

`;
 