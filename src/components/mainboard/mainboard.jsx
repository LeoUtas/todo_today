import "./mainboard.css";
import "../../index.css";

const Task = ({ task, onDeleteTask, onToggleTask }) => {
    return (
        <div className="mainboard">
            <li>
                <input
                    className="check-btn"
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggleTask(task.id)}
                />
                <span
                    style={task.done ? { textDecoration: "line-through" } : {}}
                >
                    {task.taskDescription}
                </span>
                <button
                    className="delete-btn"
                    onClick={() => onDeleteTask(task.id)}
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
                <div className="barplot">Let's have a look at your records</div>
            ) : (
                <div>
                    <ul className="list">
                        {tasks.map((task) => (
                            <Task
                                task={task}
                                onDeleteTask={onDeleteTask}
                                onToggleTask={onToggleTask}
                                key={task.id}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Mainboard;
