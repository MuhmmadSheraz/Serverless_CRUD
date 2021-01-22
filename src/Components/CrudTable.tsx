import React, { useEffect, useState } from "react";
import style from "./crud.module.css";
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, CircularProgress, TextField } from "@material-ui/core";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  root: {
    "& > *": {
      // margin: theme.spacing(1),
      width: "100%",
      margin: "10px 0px",
    },
  },
});

export default function CrudTable() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [todos, setTodos] = useState([]);
  const [currentId, setCurrentId] = useState<string>("");
  //Use Efffect For Render All Todos On Reload
  useEffect(() => {
    getList();
  }, []);
  // Get ALL TODOS INITIALLY
  const getList = async () => {
    await fetch(`/.netlify/functions/getAllTodos`)
      .then((response) => response.json())
      .then((obj) => {
        console.log(obj.data);
        setTodos(obj.data);
        setLoading(false);
      });
  };
  // CRUD Functions

  // Add
  const add = async () => {
    await fetch(`/.netlify/functions/addTodo`, {
      method: "POST",
      body: JSON.stringify(input),
    })
      .then((response) => response.json())
      .then((res) => {
        setTodos((preval: any) => {
          return [...preval, res];
        });
        setInput("");
      });
  };
  // Delete
  const deleteTodo = (id: string) => {
    setLoading(true);
    console.log(id);
    fetch("/.netlify/functions/deleteTodo", {
      method: "delete",
      body: JSON.stringify(id),
    }).then(() => {
      getList();
    });
  };
  // Edit
  const edit = (id, title) => {
    setCurrentId(id);
    setInput(title);
    setIsEditing(true);
  };
  // Update
  const updateTodo = () => {
    setLoading(true);
    console.log(input, currentId);
    let obj = {
      title: input,
      id: currentId,
    };
    fetch("/.netlify/functions/updateTodo", {
      method: "PUT",
      body: JSON.stringify({ input, currentId }),
    }).then(() => {
      getList();
      setInput("");
      setIsEditing(false);
    });
  };

  const classes = useStyles();

  return (
    <div className={style.center}>
      <div style={{ width: "100%" }}>
        <div className={style.input_wrapper}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              label="Task"
              variant="outlined"
              style={{ width: "100%" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
          {!isEditing ? (
            <Button
              className={style.addBtn}
              variant="outlined"
              color="secondary"
              onClick={add}
            >
              Add
            </Button>
          ) : (
            <Button
              className={style.addBtn}
              variant="outlined"
              color="primary"
              onClick={updateTodo}
            >
              Update
            </Button>
          )}
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell align="right">Updated At</StyledTableCell>
                <StyledTableCell align="right">Edit</StyledTableCell>
                <StyledTableCell align="right" color="secondary">
                  Delete
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.length && !loading ? (
                todos.map((row) => (
                  <StyledTableRow key={row.ref["@ref"].id}>
                    <StyledTableCell component="th" scope="row">
                      {row.data.title}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.data.ts}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        onClick={() => edit(row.ref["@ref"].id, row.data.title)}
                        variant="contained"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        onClick={() => deleteTodo(row.ref["@ref"].id)}
                        variant="contained"
                        color="secondary"
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <div className={style.loader}>
                  <CircularProgress color="secondary" size={50} />
                </div>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
