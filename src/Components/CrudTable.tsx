import React, { useEffect, useState } from "react";
import style from "./crud.module.css";
import { Edit, Delete, Add, DoneOutline, Done } from "@material-ui/icons";

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
import {
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  root: {
    "& > *": {
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
        setTodos(obj.data);
        setLoading(false);
      });
  };
  // CRUD Functions

  // Delete
  const deleteTodo = (id: string) => {
    setLoading(true);
    fetch("/.netlify/functions/deleteTodo", {
      method: "delete",
      body: JSON.stringify(id),
    }).then(() => {
      getList();
      setLoading(false);
    });
  };
  // Edit
  const edit = (id: string, title: string) => {
    setCurrentId(id);
    setVal(title);
    setIsEditing(true);
  };

  const classes = useStyles();
  const validation = Yup.object({
    todoInput: Yup.string().required("Required Field"),
  });

  return (
    <div className={style.center}>
      <div style={{ width: "100%", paddingBottom: "20px" }}>
        <div className={style.input_wrapper}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: currentId,
              todoInput: val ? val : "",
              // todoInput: "",
            }}
            onSubmit={(values: any, actions: any) => {
              if (!isEditing) {
                setLoading(true);
                fetch(`/.netlify/functions/addTodo`, {
                  method: "POST",
                  body: JSON.stringify(val),
                })
                  .then((response) => response.json())
                  .then((res) => {
                    setTodos((preval: any) => {
                      return [...preval, res];
                    });
                    actions.resetForm({
                      values: {
                        id: "",
                        todoInput: "",
                      },
                    });
                    setVal("");
                    setLoading(false);
                  });
              } else if (isEditing) {
                setLoading(true);
                fetch("/.netlify/functions/updateTodo", {
                  method: "PUT",
                  body: JSON.stringify({ values }),
                }).then(() => {
                  getList();
                  setVal("");
                  setIsEditing(false);
                  setLoading(false);
                });
              }
            }}
            validationSchema={validation}
          >
            {(formik) => {
              return (
                <Form
                  className={style.form}
                  onSubmit={formik.handleSubmit}
                  onChange={formik.handleChange}
                >
                  <Field
                    className={style.field}
                    as={TextField}
                    name="todoInput"
                    handleSubmit
                    onChange={(e) => setVal(e.target.value)}
                    id="outlined-basic"
                    label="Todo Task"
                    variant="outlined"
                    value={val}
                  />
                  <div>
                    <ErrorMessage
                      name="todoInput"
                      render={(mes) => (
                        <span
                          style={{ display: "block " }}
                          className={style.red}
                        >
                          {mes}
                        </span>
                      )}
                    />
                  </div>

                  {!isEditing ? (
                    <Button className={style.addBtn} type="submit" size="large">
                      <Done /> Add
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className={style.addBtn}
                      variant="outlined"
                      color="primary"
                    >
                      <DoneOutline />
                    </Button>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
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
