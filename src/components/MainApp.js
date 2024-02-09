import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Header from "./header/header";
import Form from "./form/form";
import Mainboard from "./mainboard/mainboard";
import Stats from "./mainboard/stats";
import InspiringBoard from "./inspiringboard/inspiringboard";
import Footer from "./footer/footer";

import supabase from "../supabase";
import { NotYetMessage, NewDayMessage, NoStatsAlert } from "./messages/message";

const MainApp = ({ userId, displayName, setUserAccessToken }) => {
    const uerIdArg = userId;
    const [tasks, setTasks] = useState([]);
    const [tasksUpdated, setTasksUpdated] = useState(false);
    const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);

    const numberListedTasks = tasks.length;
    const numberCompletedTasks = tasks.filter((task) => task.done).length;
    const percentageDone = Number(
        ((numberCompletedTasks * 100) / numberListedTasks).toFixed(2)
    );

    useEffect(() => {
        // Define a fetchTasks function
        const fetchTasks = async () => {
            let { data: tasks, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("userId", uerIdArg);

            if (error) {
                console.error("Error fetching tasks:", error);
            } else {
                setTasks(tasks);
                setIsLoadingAIResponse(true);
                setTasksUpdated(true);
            }
        };

        // Call the fetchTasks function
        fetchTasks();
    }, [uerIdArg]); // Add uerIdArg as a dependency here

    const handleAddTask = (task) => {
        setTasks((tasks) => [...tasks, task]);
        setTasksUpdated(true);
    };

    const handleDeleteTask = async (id) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id);

        if (error) {
            console.error("Error deleting task:", error);
            return;
        }

        setTasks((items) => items.filter((item) => item.id !== id));
        setTasksUpdated(true);
    };

    const handleToggleTask = async (id) => {
        const taskToToggle = tasks.find((task) => task.id === id);
        if (!taskToToggle) return;

        // Toggle the 'done' status
        const updatedDoneStatus = !taskToToggle.done;

        const { error } = await supabase
            .from("tasks")
            .update({ done: updatedDoneStatus }) // Update 'done' status
            .eq("id", id);
        if (error) {
            console.error("Error updating task:", error);
            return;
        }

        setTasks((tasks) =>
            tasks.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
        setTasksUpdated(true);
    };

    // handle the AI response
    const [aiResponse, setAIResponse] = useState("");
    // "https://todotoday-backend0-4172a0c6219f.herokuapp.com/get-ai-response/";
    // "https://aichatbot-backend-c82886e0972c.herokuapp.com/get_ai_response_for_todotoday/"
    // "http://localhost:8000/get-ai-response/";

    useEffect(() => {
        const fetchAIResponse = async () => {
            try {
                const response = await axios.post(
                    "https://aichatbot-backend-c82886e0972c.herokuapp.com/get_ai_response_for_todotoday/",
                    { percentage_done: percentageDone }
                );
                setAIResponse(response.data.ai_response);
            } catch (error) {
                console.error("Error fetching AI response:", error);
            }

            setTasksUpdated(false);
            setIsLoadingAIResponse(false);
        };

        if (tasksUpdated) {
            setIsLoadingAIResponse(true);
            fetchAIResponse();
        }
    }, [percentageDone, tasksUpdated]);

    // handle NewDay functionality
    const [showNotYetMessage, setShowNotYetMessage] = useState(false);
    const [showNewDayMessage, setShowNewDayMessage] = useState(false);

    const handleNewDayClick = async () => {
        if (tasks.length === 0) {
            return;
        } else {
            const TimePoint1 = new Date().toISOString().split("T")[0];

            const dates = tasks
                .map((task) => new Date(task.created_at))
                .sort((a, b) => a - b);
            const TimePoint0 = dates[0].toISOString().split("T")[0];
            // console.log("0: ", TimePoint0);
            // console.log("1: ", TimePoint1);

            if (TimePoint0 !== TimePoint1) {
                setShowNewDayMessage(true);
            } else {
                setShowNotYetMessage(true);
            }
        }
    };

    const handleNewDayConfirmed = async () => {
        setShowNewDayMessage(false);

        const numberListedTasks = tasks.length;
        const numberCompletedTasks = tasks.filter((task) => task.done).length;

        // Insert stats into Supabase
        const { error: newDayError } = await supabase.from("stats").insert([
            {
                numberListedTasks: numberListedTasks,
                numberCompletedTasks: numberCompletedTasks,
                userId: uerIdArg,
            },
        ]);

        if (newDayError) {
            console.error("Error inserting stats:", newDayError);
            return;
        }

        const { error: deleteError } = await supabase
            .from("tasks")
            .delete()
            .eq("userId", uerIdArg); // Only delete tasks that match the uerIdArg

        if (deleteError) {
            console.error("Error updating task:", deleteError);
            return;
        } else {
            setTasks([]);
        }
    };

    const [statsData, setStatsData] = useState([]);
    const [showNoStatsAlert, setShowNoStatsAlert] = useState(false);

    const fetchStats = async () => {
        let { data: stats, error } = await supabase
            .from("stats")
            .select("*")
            .eq("userId", uerIdArg); // Filter by uerIdArg;

        if (error) {
            console.error("Error fetching Stats:", error);
        } else {
            if (stats && stats.length > 0) {
                const statsData = stats.map((stats) => {
                    const createdAtDate = new Date(stats.created_at);
                    const year = createdAtDate.getFullYear();
                    const month = createdAtDate.getMonth() + 1;
                    const day = createdAtDate.getDate();
                    const formattedDate = `${year}-${month
                        .toString()
                        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

                    return {
                        id: stats.id,
                        numberCompletedTasks: stats.numberCompletedTasks,
                        numberListedTasks: stats.numberListedTasks,
                        formattedDate: formattedDate,
                        userId: stats.userId,
                    };
                });

                setStatsData(statsData);
            } else {
                setShowNoStatsAlert(true);
                setShowStats(false);
            }
        }
    };

    // show Today or show History
    const [showStats, setShowStats] = useState(false);
    const [viewStatsButtonLabel, setViewStatsButtonLabel] =
        useState("View history");

    const handleClickViewStats = () => {
        setShowStats(!showStats);
        setViewStatsButtonLabel((label) =>
            label === "View history" ? "View today" : "View history"
        );
        fetchStats(); // Reload the stats data
    };

    return (
        <div>
            <>
                <Header
                    onNewDayClick={handleNewDayClick}
                    setUserAccessToken={setUserAccessToken}
                    displayName={displayName}
                />
                <Form userId={uerIdArg} onAddTask={handleAddTask} />
                <Mainboard
                    tasks={tasks}
                    onDeleteTask={handleDeleteTask}
                    onToggleTask={handleToggleTask}
                    showStats={showStats}
                />
                {showStats && <Stats statsData={statsData} />}
                <InspiringBoard
                    tasks={tasks}
                    percentageDone={percentageDone}
                    numberListedTasks={numberListedTasks}
                    numberCompletedTasks={numberCompletedTasks}
                    isLoadingAIResponse={isLoadingAIResponse}
                    aiResponse={aiResponse}
                />
                <Footer
                    onClickViewStats={handleClickViewStats}
                    buttonLabel={viewStatsButtonLabel}
                />

                <NoStatsAlert
                    isOpen={showNoStatsAlert}
                    message="Oops, you don't have a stats record yet!"
                    onClose={() => setShowNoStatsAlert(false)}
                />

                <NotYetMessage
                    isOpen={showNotYetMessage}
                    message="Not a day yet, mate! Get done as much as you can before starting a new day."
                    onClose={() => setShowNotYetMessage(false)}
                />

                <NewDayMessage
                    isOpen={showNewDayMessage}
                    message="All listed tasks will be removed. The day will be recorded. Are you sure to start a new day?"
                    onClose={() => setShowNewDayMessage(false)}
                    onConfirm={handleNewDayConfirmed}
                />
            </>
        </div>
    );
};

export default MainApp;
