import "./mainboard.css";
import "../index.css";

const Task = ({ task, onDeleteTask, onToggleTask }) => {
    return (
        <div className="mainboard">
            <li>
                <input
                    className="check-btn"
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggleTask(task.id_now)}
                />
                <span
                    style={task.done ? { textDecoration: "line-through" } : {}}
                >
                    {task.taskDescription}
                </span>
                <button
                    className="delete-btn"
                    onClick={() => onDeleteTask(task.id_now)}
                >
                    ❌
                </button>
            </li>
        </div>
    );
};

const Mainboard = ({ tasks, onDeleteTask, onToggleTask, showStats }) => {
    return (
        <>
            {showStats ? (
                <div className="barplot">
                    Let's have a look at the statistics{" "}
                </div>
            ) : (
                <div>
                    <ul className="list">
                        {tasks.map((task) => (
                            <Task
                                task={task}
                                onDeleteTask={onDeleteTask}
                                onToggleTask={onToggleTask}
                                key={task.id_now}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Mainboard;
