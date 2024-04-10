import React from 'react';
import PlateList from './components/PlateList';
import CreatePlate from './components/CreatePlate';

const App: React.FC = () => {
  return (
      <div>
        <h1>CRUD App with Axios and React</h1>
        <CreatePlate onSuccess={() => {
            console.log("updated")
        }}/>
        <hr />
        <PlateList />
      </div>
  );
};

export default App;
