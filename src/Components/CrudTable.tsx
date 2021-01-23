import React, { useEffect, useState } from "react";
import style from "./crud.module.css";
import { Edit, Delete, Add } from "@material-ui/icons";

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
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  setNestedObjectValues,
} from "formik";
import * as Yup from "yup";

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
  const [val, setVal] = useState<string>("");
  const [todos, setTodos] = useState([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [editValue, setEditValue] = useState("");
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
    console.log("Add ", val);
    await fetch(`/.netlify/functions/addTodo`, {
      method: "POST",
      body: JSON.stringify(val),
    })
      .then((response) => response.json())
      .then((res) => {
        setTodos((preval: any) => {
          return [...preval, res];
        });
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
  const edit = (id: string, title: string) => {
    console.log("Edit===>", id, title);
    setCurrentId(id);
    setEditValue(title);
    setVal(title);
    setIsEditing(true);
  };

  const classes = useStyles();
  const validation = Yup.object({
    todoInput: Yup.string().required("required"),
  });

  return (
    <div className={style.center}>
      <div style={{ width: "100%" }}>
        <div className={style.input_wrapper}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: currentId,
              message: editValue == "" ? "" : editValue,
            }}
            onSubmit={(values: any, actions: any) => {
              console.log("values======>", values);
              console.log("State", val);
              if (!isEditing) {
                console.log("Add ", val);
                fetch(`/.netlify/functions/addTodo`, {
                  method: "POST",
                  body: JSON.stringify(val),
                })
                  .then((response) => response.json())
                  .then((res) => {
                    setVal("");

                    setTodos((preval: any) => {
                      return [...preval, res];
                    });
                    //resetForm
                  });
              } else if (isEditing) {
                console.log("values For Update", values);

                console.log("Updating", values.id);

                fetch("/.netlify/functions/updateTodo", {
                  method: "PUT",
                  body: JSON.stringify({ values }),
                }).then((res) => {
                  console.log("Update Response===>", res);
                  getList();
                  setVal("");
                  setIsEditing(false);
                  console.log("Updated");
                });
              }
            }}
            validationSchema={validation}
          >
            {(formik) => (
              <Form
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}
              >
                <Field
                  name="todoInput"
                  placeholder="Todo Input"
                  as={TextField}
                  handleSubmit
                  onChange={(e) => setVal(e.target.value)}
                  value={val}
                />
                {
                  <ErrorMessage
                    name="todoInput"
                    render={(mes) => <span>{mes}</span>}
                  />
                }

                {!isEditing ? (
                  <Button
                    className={style.addBtn}
                    variant="outlined"
                    color="secondary"
                    // onClick={add}
                    type="submit"
                    // disabled={isSubmitting}
                  >
                    {/* Add  */}
                    <Add />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={style.addBtn}
                    variant="outlined"
                    color="primary"
                  >
                    Update
                  </Button>
                )}
              </Form>
            )}
          </Formik>
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
                  // let date=newDate(row.ts)
                  <StyledTableRow key={row.ref["@ref"].id}>
                    <StyledTableCell component="th" scope="row">
                      {row.data.title}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {/* {new Date(row.ts)} */}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        onClick={() => edit(row.ref["@ref"].id, row.data.title)}
                        variant="contained"
                        color="primary"
                      >
                        {/* Edit */}
                        <Edit />
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        onClick={() => deleteTodo(row.ref["@ref"].id)}
                        variant="contained"
                        color="secondary"
                      >
                        {/* Delete */}
                        <Delete />
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
