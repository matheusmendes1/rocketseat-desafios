import React, { useState, useEffect } from "react";
import api from './services/api';

import Header from './Components/Header';

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api
      .get('/repositories')
      .then(res => {
        setRepositories(res.data);
      })
  }, []);

  async function handleAddRepository() {

    const resp = await api.post('/repositories', {
      title: `Novo projeto ${Date.now()}`,
      url: `Nova url ${Date.now()}`,
      techs: ['Tech One', 'Tech Two']
    });

    const rep = resp.data;
    setRepositories([... repositories, rep]);
  }

  async function handleRemoveRepository(id) {

    const resp = await api.delete(`/repositories/${id}`);

    const repositorie = repositories.find(rep => rep.id === id);
    const repositoriesFiltered = repositories.filter(rep => (rep.id !== repositorie.id));

    setRepositories(repositoriesFiltered);

    console.log(resp);
  }

  return (
    <div>
      <Header title="Repositories"/>

      <ul data-testid="repository-list">

        { repositories.map(repositorie => { return ( 

          <li key={repositorie.id}>
            {repositorie.title}
            <button onClick={() => handleRemoveRepository(repositorie.id)}>
              Remover
            </button>
          </li>

        )})}

      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
