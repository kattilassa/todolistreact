import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AddTodo from './AddTodos';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
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


  const fetchItems = async () => {
    try {
      const res = await fetch('https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items.json')
      const data = await res.json()
      addKeys(data)
    } catch (err) {
      console.error(err)
    }
  }
  const deleteItems = async () => {
    try {
      await Promise.all(
        todos.map(todo => {
        fetch(`https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items/${todo.id}.json`, {
          method: 'DELETE',
        })
      })
    )
      setTodos([])
    } catch(err) {
      console.error(err)
    }

  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] }));
    setTodos(valueKeys);
  }

  const addTodo = async (newTodo) => {
    try {
      await fetch('https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items.json',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo)
        }
      )
        await fetchItems()
    } catch(err) {
      console.error(err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://todolist-f7f38-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
        {
          method: 'DELETE',
        })
        await fetchItems()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Simple Todo List
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo}/>
      <Button variant="outlined" onClick={deleteItems}
      >
        Clear TODO list
      </Button>
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
