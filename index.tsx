import { Elysia } from "elysia";
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

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

const db: Todo[] = [
  { id: 1, content: "Finish BETH Stack", completed: false },
  { id: 2, content: "Learn VIM", completed: false },
];

function ToDoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input type="check" checked={completed} />
      <button class="text-red-500">X</button>
    </div>
  );
}

function ToDoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <ToDoItem {...todo} />
      ))}
    </div>
  );
}
