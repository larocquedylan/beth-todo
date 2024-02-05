import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        {/* <body
          class={"flex flex-col w-full h-screen justify-center items-center"}>
          <h1 class="px-auto"> Hello World</h1>
          <button
            hx-post="/clicked"
            hx-swap="outerHTML"
            class={"cursor-pointer"}>
            Lick Me
          </button>
        </body> */}
        <body
          class={"flex flex-col w-full h-screen justify-center items-center"}
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
        />
      </BaseHtml>
    )
  )
  .post("/clicked", () => <div class="text-blue-600"> you clicked </div>)
  .get("/todos", () => <ToDoList todos={db} />)
  .post(
    "/todos/toggle/:id",
    ({ params }) => {
      // get the to do item with the matching params '/:id' prefix = '/:' and params 'id'
      const todo = db.find((todo) => todo.id == params.id);
      // if there is an item matching, updates its completed value
      if (todo) {
        todo.completed = !todo.completed;
        return <ToDoItem {...todo} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .listen(3214);

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

// define some base html as shell for the app
const BaseHtml = ({ children }: elements.Children) => `
<!Doctype html>
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Hello </title>
    <script src="https://unpkg.com/htmx.org@1.9.3"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
${children}
`;

// todo schema
type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

// mock a db
const db: Todo[] = [
  { id: 1, content: "Finish BETH Stack", completed: true },
  { id: 2, content: "Learn VIM", completed: false },
];

// function to read a to do and create an element for it
function ToDoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/:${id}`}
      />
      <button class="text-red-500">X</button>
    </div>
  );
}

// function to map through todo items and create an element for it
function ToDoList({ todos }: { todos: Todo[] }) {
  return (
    <div class="flex flex-col justify-start">
      {todos.map((todo) => (
        <ToDoItem {...todo} />
      ))}
    </div>
  );
}
