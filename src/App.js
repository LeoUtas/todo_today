import React from "react";
import { useState, useEffect } from "react";
import Header from "./header/header";
import Form from "./form/form";
import Mainboard from "./mainboard/mainboard";
import Stats from "./mainboard/stats";
import InspiringBoard from "./inspiringboard/inspiringboard";
import Footer from "./footer/footer";

import supabase from "../src/supabase";
import { NotYetMessage, NewDayMessage } from "./messages/message";

const App = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        //define a fetchTasks function
        const fetchTasks = async () => {
            let { data: tasks, error } = await supabase
                .from("tasks")
                .select("*");

            if (error) {
                console.error("Error fetching tasks:", error);
            } else {
                setTasks(tasks);
            }
        };
        // call the fetchTasks function
        fetchTasks();
    }, []);

    const handleAddTask = (task) => {
        setTasks((tasks) => [...tasks, task]);
    };

    const handleDeleteTask = async (id_now) => {
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id_now", id_now);

        if (error) {
            console.error("Error deleting task:", error);
            return;
        }

        setTasks((items) => items.filter((item) => item.id_now !== id_now));
    };

    const handleToggleTask = async (id_now) => {
        const taskToToggle = tasks.find((task) => task.id_now === id_now);
        if (!taskToToggle) return;

        // Toggle the 'done' status
        const updatedDoneStatus = !taskToToggle.done;

        const { error } = await supabase
            .from("tasks")
            .update({ done: updatedDoneStatus }) // Update 'done' status
            .eq("id_now", id_now);
        if (error) {
            console.error("Error updating task:", error);
            return;
        }

        setTasks((tasks) =>
            tasks.map((task) =>
                task.id_now === id_now ? { ...task, done: !task.done } : task
            )
        );
    };

    const [showNotYetMessage, setShowNotYetMessage] = useState(false);
    const [showNewDayMessage, setShowNewDayMessage] = useState(false);

    const handleNewDayClick = async () => {
        if (tasks.length === 0) {
            return;
        } else {
            const TimePoint1 = new Date();
            const dates = tasks
                .map((task) => new Date(task.created_at))
                .sort((a, b) => a - b);
            const TimePoint0 = dates[0];
            const hoursDifference =
                (TimePoint1 - TimePoint0) / (1000 * 60 * 60);

            if (hoursDifference >= 24) {
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
            },
        ]);

        if (newDayError) {
            console.error("Error inserting stats:", newDayError);
            return;
        }

        const { error: deleteError } = await supabase
            .from("tasks")
            .delete()
            .not("id_now", "is", null);

        if (deleteError) {
            console.error("Error updating task:", deleteError);
            return;
        } else {
            setTasks([]);
        }
    };

    const [statsData, setStatsData] = useState([]);

    const fetchStats = async () => {
        let { data: stats, error } = await supabase.from("stats").select("*");

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
                    };
                });

                setStatsData(statsData);
            } else {
                alert("No stats found");
            }
        }
    };

    // useEffect for loading statsData for the first time
    useEffect(() => {
        fetchStats();
    }, []);

    const [showStats, setShowStats] = useState(false);

    const handleClickViewStats = () => {
        setShowStats(!showStats);
        fetchStats(); // Reload the stats data
    };

    return (
        <div>
            <>
                <Header onNewDayClick={handleNewDayClick} />
                <Form onAddTask={handleAddTask} />
                <Mainboard
                    tasks={tasks}
                    onDeleteTask={handleDeleteTask}
                    onToggleTask={handleToggleTask}
                    showStats={showStats}
                />
                {showStats && <Stats statsData={statsData} />}
                <InspiringBoard tasks={tasks} />
                <Footer onClickViewStats={handleClickViewStats} />

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

export default App;
