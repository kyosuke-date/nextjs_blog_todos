import { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { getAllTasksData } from "../lib/tasks";
import Task from "../components/Task";
import useSWR from "swr";
import StateContextProvider from "../context/StateContext";
import TaskForm from "../components/TaskForm";

const fetcher = (url) => fetch(url).then((res) => res.json());
// const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`;
const apiUrl = "https://nextjs-api-first.herokuapp.com/api/list-task/";

export default function TaskPage({ staticFilteredTasks }) {
  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    initialData: staticFilteredTasks,
  });
  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  useEffect(() => {
    mutate();
  }, []);

  return (
    <StateContextProvider>
      <Layout title="Task page">
        <TaskForm taskCreated={mutate} />
        <ul>
          {filteredTasks &&
            filteredTasks.map((task) => (
              <Task key={task.id} task={task} taskDeleted={mutate} />
            ))}
        </ul>
        <Link href="main-page">
          <div className="flex cursor-pointer mt-12">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            <span>Back to Main page</span>
          </div>
        </Link>
      </Layout>
    </StateContextProvider>
  );
}

export async function getStaticProps() {
  const staticFilteredTasks = await getAllTasksData();

  return {
    props: {
      staticFilteredTasks,
    },
    revalidate: 3,
  };
}
