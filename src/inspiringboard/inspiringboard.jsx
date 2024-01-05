import "../index.css";
import "./inspiringboard.css";

const InspiringBoard = ({ tasks, showStats }) => {
    if (!tasks.length && !showStats)
        return <p>Add something to the to do list for today ⚒️</p>;

    const numberListedTasks = tasks.length;
    const numberCompletedTasks = tasks.filter((task) => task.done).length;
    const percentageDone = Number(
        ((numberCompletedTasks * 100) / numberListedTasks).toFixed(2)
    );

    return (
        <div className="inspiring-board">
            {showStats ? (
                <h1>HI</h1>
            ) : (
                <div>
                    {percentageDone >= 80
                        ? `You did great today 👍 (${percentageDone}% done)`
                        : `You have ${numberListedTasks} tasks on the list, and you already did ${numberCompletedTasks} (${percentageDone}% done)`}
                </div>
            )}
        </div>
    );
};

export default InspiringBoard;
