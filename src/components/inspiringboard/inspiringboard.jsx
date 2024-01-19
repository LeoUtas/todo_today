import "../../index.css";
import "./inspiringboard.css";

const InspiringBoard = ({
    tasks,
    showStats,
    numberCompletedTasks,
    percentageDone,
    numberListedTasks,
    isLoadingAIResponse,
    aiResponse,
}) => {
    if (!tasks.length && !showStats)
        return <p>Add something to the to do list for today ⚒️</p>;

    return (
        <div className="inspiring-board">
            {showStats ? (
                <h1>Hi</h1>
            ) : (
                <div className="inspiring_message">
                    {isLoadingAIResponse ? (
                        <div>...... m m ......</div>
                    ) : aiResponse.length === 0 ? (
                        <div>
                            {percentageDone >= 80
                                ? `You did great today 👍 (${percentageDone}% done)`
                                : `You have ${numberListedTasks} tasks on the list, and you already did ${numberCompletedTasks} (${percentageDone}% done)`}
                        </div>
                    ) : (
                        `${aiResponse} (${percentageDone}% done)`
                    )}
                </div>
            )}
        </div>
    );
};

export default InspiringBoard;
