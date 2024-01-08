import { useState } from "react";
import supabase from "../../supabase";
import "./form.css";
import "../../index.css";

const Form = ({ onAddTask, userId }) => {
    const [taskDescription, setTaskDescription] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (!taskDescription) return;

        const { data: newTask, error } = await supabase
            .from("tasks")
            .insert([
                {
                    userId: userId,
                    taskDescription,
                    done: false,
                },
            ])
            .select();

        if (error) {
            console.error("Insert error:", error);
            return;
        }

        if (newTask) {
            onAddTask(newTask[0]);
        }

        setTaskDescription("");
    }

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="enter task ..."
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
            />
            <button className="btn">Add</button>
        </form>
    );
};

export default Form;
