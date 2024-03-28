import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Todo } from "../../types";
import { FetchCreateTeamTodo, FetchGetTodo } from "../api/todo";

export interface TodoState {
  todos: Todo[] | undefined;
  activeTodo: Todo | undefined;
  error: string | null;
}

const saveTodoToLocalStorage = (activeTodo: Todo) => {
  localStorage.setItem("activeTeam", JSON.stringify(activeTodo));
};
const loadTodoFromLocalStorage = (): Todo | undefined => {
  const storedTodo = localStorage.getItem("activeTdoId");
  return storedTodo ? JSON.parse(storedTodo) : undefined;
};

export const initialState: TodoState = {
  todos: [],
  activeTodo: undefined,
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

export const getTodoAsync = createAsyncThunk<
  Todo[],
  string,
  { rejectValue: string }
>("todo/getTodo", async (teamId, thunkAPI) => {
  try {
    console.log("TEAMID :", teamId);
    const todos = await FetchGetTodo(teamId);
    return todos;
  } catch (error) {
    console.error("Error getting todo:", error);
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});


const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
   setActiveTodo: (state, action) => {
  const todoId = action.payload;
  const activeTodo = state.todos?.find((todo) => todo.id === todoId);
  if (activeTodo) {
    state.activeTodo = activeTodo; 
    saveTodoToLocalStorage(activeTodo);
  }
},
 
    getActiveTodo: (state) => {
      const activeTodoId = loadTodoFromLocalStorage();
      if (activeTodoId) {
        console.log("ACTIVE TEAM: ", activeTodoId);
        state.activeTodo = activeTodoId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createTeamTodoAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.todos = state.todos ?? []; // Ensure state.todos is initialized
        state.todos.push(action.payload);
        state.error = null;
      }
    })
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
      .addCase(createTeamTodoAsync.rejected, (state) => {
        state.todos = undefined;
        state.error = "Något gick fel med skapandet av konto.";
      });
  },
});

export const todoReducer = todoSlice.reducer;
export const { setActiveTodo } = todoSlice.actions;
