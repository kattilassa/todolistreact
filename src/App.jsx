import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AddTodo from './AddTodos';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css'

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [todos, setTodos] = useState([])
  const [colDefs, setColDefs] = useState([
    { field: 'description', sortable: true, filter: true },
    { field: 'date', sortable: true, filter: true },
    { field: 'priority', sortable: true, filter: true },
        {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params =>
        <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    },
  ]);

  useEffect(() => {
    fetchItems();
  }, [])


  const fetchItems = () => {
    fetch('https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items.json')
      .then(response => response.json())
      .then(data => addKeys((data)))
      .catch(err => console.error(err))
  }

  // Add keys to the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] }));
    setTodos(valueKeys);
  }

  const addTodo = (newTodo) => {
  fetch('https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items.json',
      {
        method: 'POST',
        body: JSON.stringify(newTodo)
      })
      .then(res => fetchItems())
      .catch(err => console.error(err))
  }

  const deleteTodo = (id) => {
    fetch(`https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
      {
        method: 'DELETE',
      })
      .then(res => fetchItems())
      .catch(err => console.error(err))
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            TodoList
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo}/>
      <div style={{ height: 500, width: 700 }}>
        <AgGridReact
          rowData={todos}
          columnDefs={colDefs}
        />
      </div>
      </div>
  );
}

export default App;
