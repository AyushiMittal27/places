import React , {useState , useCallback , useEffect} from 'react';
import {BrowserRouter as Router , Route ,Switch} from 'react-router-dom'
import {User} from './user/pages/User'
import {UserPlaces} from './places/pages/UserPlaces'
import MainNavigation from './shared/component/UIElement/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace'
import NewPlace from './places/pages/NewPlace'
import Auth from './user/pages/Auth'
import {AuthContext} from './shared/component/context/auth-context'
import {useAuth} from '/shared/hooks/auth-hook';

function App() {

const {token , login , logout , userId} = useAuth();

let routes;

if(token){
  routes = (
    <Switch>
  <Route path='/' exact><User /></Route>
  <Route path='/:userId/places' exact>
     <UserPlaces />
  </Route>   
     <Route path='/auth' exact>
     <Auth />
     </Route>
     <Redirect to='/auth'>
     </Redirect>
     </Switch>
  )
}
else{
  routes= (<Switch>
  <Route path='/' exact><User /></Route>
  <Route path='/:userId/places' exact>
     <UserPlaces />
  </Route>   
  <Route path='/places/new' exact>1
    <NewPlace />
   </Route>   
   <Route path='/places/:placeId' exact>
    <NewPlace />
   </Route>   
   <Redirect to='/'>
   </Redirect>
   </Switch>
 )
}

  return (
<AuthContext.Provider value={{isLoggedIn: !!token, token:token ,userId:userId, login: login , logout :logout}}> 
<Router>
   <MainNavigation />
   <main>
     {routes}  
   </main> 
   </Router>
   </AuthContext.Provider>
  );
}

export default App;
