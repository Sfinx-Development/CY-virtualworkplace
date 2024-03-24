
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Todo} from "../../types";

import { FetchCreateTeamTodo, FetchGetTodo } from "../api/todo";

export interface TodoState {
  todos: Todo[] | undefined;
  activeTodoId: string | undefined;
  teamTodos: Todo[] | undefined;
  // deletemeeting: MeetingOccasion | undefined;
  error: string | null;
}

export const initialState: TodoState = {
  todos: undefined,
  activeTodoId: undefined,
  teamTodos: undefined,
  // deletemeeting: undefined,
  error: null,
};


export const createTeamTodoAsync = createAsyncThunk<
  Todo,
  Todo,
  { rejectValue: string }
>("todo/createTeamTodo", async (todo, thunkAPI) => {
  try {
    const createdTodo = await FetchCreateTeamTodo(todo);
    if (createdTodo) {
      return createdTodo;
    } else {
      return thunkAPI.rejectWithValue("failed to add todo");
    }
  } catch (error) {
    console.error("Error creating todo:", error);
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});




export const getTodoAsync = createAsyncThunk<Todo>("todo/getTodo", async () => {
  try {
    const todo = await FetchGetTodo();
    return todo;
  } catch (error) {
    console.error(error);
    throw new Error("Ett fel uppstod vid inloggningen.");
  }
});


const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodoAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.todos = action.payload;
          state.error = null;
        }
      })
      .addCase(getTodoAsync.rejected, (state) => {
        state.todos = undefined;
        state.error = "Auth is not correct.";
      })
      .addCase(createTeamTodoAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.error = null;
        }
      })
      .addCase(createTeamTodoAsync.rejected, (state) => {
        state.teamTodos = undefined;
        state.error = "Något gick fel med skapandet av konto.";
      });
  },
});

export const todoReducer = todoSlice.reducer;
