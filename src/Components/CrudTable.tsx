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

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

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
  const [input, setInput] = useState<string>("");
  const [todos, setTodos] = useState([]);
  //Use Efffect For Render All Todos On Reload
  useEffect(() => {
    console.log("Get All TODOS");
    getList();
  }, []);
  const getList = async () => {
    console.log("Fetching TODOS");
    await fetch(`/.netlify/functions/getAllTodos`)
      .then((response) => response.json())
      .then((obj) => {
        obj.data.map((x) => {
          console.log(x);
          let obj = {
            todoTitle: x.data.title,
            timeStamp: x.ts,
            id: x.ref["@ref"].id,
          };
          setTodos((preVal) => {
            return [...preVal, obj];
          });
        });
      });
  };
  // CRUD Functions
  const add = async () => {
    await fetch(`/.netlify/functions/addTodo`, {
      method: "post",
      body: JSON.stringify(input),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);

        setTodos((preval: any) => {
          return [...preval, res];
        });
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
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
          <Button
            className={style.addBtn}
            variant="outlined"
            color="secondary"
            onClick={add}
          >
            Add
          </Button>
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
              {todos.length ? (
                todos.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.todoTitle}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.timeStamp}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button variant="contained" color="primary">
                        Edit
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button variant="contained" color="secondary">
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
