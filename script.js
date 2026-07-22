document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DATA
    // ==========================================

    let projects = JSON.parse(
        localStorage.getItem("dev_projects") || "[]"
    );

    let tasks = JSON.parse(
        localStorage.getItem("dev_tasks") || "[]"
    );

    let skills = JSON.parse(
        localStorage.getItem("dev_skills") || "[]"
    );

    let goals = JSON.parse(
        localStorage.getItem("dev_goals") || "[]"
    );

    let activities = JSON.parse(
        localStorage.getItem("dev_activities") || "[]"
    );

    let codingSessions = JSON.parse(
        localStorage.getItem("dev_coding_sessions") || "[]"
    );


    // ==========================================
    // SAVE DATA
    // ==========================================

    function saveData() {

        localStorage.setItem(
            "dev_projects",
            JSON.stringify(projects)
        );

        localStorage.setItem(
            "dev_tasks",
            JSON.stringify(tasks)
        );

        localStorage.setItem(
            "dev_skills",
            JSON.stringify(skills)
        );

        localStorage.setItem(
            "dev_goals",
            JSON.stringify(goals)
        );

        localStorage.setItem(
            "dev_activities",
            JSON.stringify(activities)
        );

        localStorage.setItem(
            "dev_coding_sessions",
            JSON.stringify(codingSessions)
        );
    }


    // ==========================================
    // ELEMENTS
    // ==========================================

    const projectCount =
        document.getElementById("projectCount");

    const completedTasks =
        document.getElementById("completedTasks");

    const codingHours =
        document.getElementById("codingHours");

    const currentStreak =
        document.getElementById("currentStreak");

    const projectGrowth =
        document.getElementById("projectGrowth");

    const taskCompletionText =
        document.getElementById("taskCompletionText");

    const weeklyCoding =
        document.getElementById("weeklyCoding");

    const longestStreak =
        document.getElementById("longestStreak");

    const monthlyProjects =
        document.getElementById("monthlyProjects");

    const monthlyTasks =
        document.getElementById("monthlyTasks");

    const monthlyCodingHours =
        document.getElementById("monthlyCodingHours");

    const projectsContainer =
        document.getElementById("projectsContainer");

    const tasksContainer =
        document.getElementById("tasksContainer");

    const skillsContainer =
        document.getElementById("skillsContainer");

    const goalsContainer =
        document.getElementById("goalsContainer");

    const activityContainer =
        document.getElementById("activityContainer");


    // ==========================================
    // DATE
    // ==========================================

    function updateDate() {

        const dateElement =
            document.getElementById("currentDate");

        if (!dateElement) return;

        const today = new Date();

        dateElement.textContent =
            today.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );
    }

    updateDate();


    // ==========================================
    // ACTIVITY
    // ==========================================

    function addActivity(message) {

        activities.unshift({

            id: Date.now(),

            message: message,

            date: new Date().toLocaleString()

        });

        activities =
            activities.slice(0, 20);

        saveData();

        renderActivities();
    }


    function renderActivities() {

        if (!activityContainer) return;

        if (activities.length === 0) {

            activityContainer.innerHTML = `

                <div class="activity-item">

                    <div class="activity-icon">
                        🚀
                    </div>

                    <div>

                        <strong>
                            No recent activity
                        </strong>

                        <p>
                            Start working to see your activity here.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        activityContainer.innerHTML =
            activities.map(activity => `

                <div class="activity-item">

                    <div class="activity-icon">
                        ⚡
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(activity.message)}
                        </strong>

                        <p>
                            ${activity.date}
                        </p>

                    </div>

                </div>

            `).join("");
    }


    // ==========================================
    // PROJECTS
    // ==========================================

    function renderProjects() {

        if (!projectsContainer) return;


        const searchInput =
            document.getElementById("projectSearch");

        const filter =
            document.getElementById("projectFilter");


        const search =
            searchInput
                ? searchInput.value.toLowerCase()
                : "";


        const filterValue =
            filter
                ? filter.value
                : "all";


        let filtered =
            projects.filter(project => {

                const matchesSearch =
                    project.name
                        .toLowerCase()
                        .includes(search);


                const matchesFilter =
                    filterValue === "all" ||

                    (
                        filterValue === "active" &&
                        project.progress < 100
                    ) ||

                    (
                        filterValue === "completed" &&
                        project.progress >= 100
                    );


                return (
                    matchesSearch &&
                    matchesFilter
                );

            });


        if (filtered.length === 0) {

            projectsContainer.innerHTML = `

                <div class="empty-state">

                    <div>
                        💻
                    </div>

                    <h3>
                        No projects yet
                    </h3>

                    <p>
                        Add your first project to get started.
                    </p>

                </div>

            `;

        } else {

            projectsContainer.innerHTML =
                filtered.map(project => `

                    <div class="project-card">

                        <h3>
                            ${escapeHTML(project.name)}
                        </h3>

                        <p>
                            ${escapeHTML(project.description)}
                        </p>

                        <div class="progress-container">

                            <div class="progress-bar">

                                <div
                                    class="progress"
                                    style="width:${project.progress}%"
                                ></div>

                            </div>

                            <span>
                                ${project.progress}%
                            </span>

                        </div>

                        <span class="project-status">

                            ${
                                project.progress >= 100
                                    ? "Completed"
                                    : "In Progress"
                            }

                        </span>

                        <div class="project-card-actions">

                            <button
                                class="edit-button"
                                onclick="editProject(${project.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-button"
                                onclick="deleteProject(${project.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("");

        }


        renderProjectProgress();

        updateStatistics();
    }


    // ==========================================
    // ADD PROJECT
    // ==========================================

    const addProjectButton =
        document.getElementById(
            "addProjectButton"
        );


    if (addProjectButton) {

        addProjectButton.addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Project name:"
                    );

                if (!name) return;


                const description =
                    prompt(
                        "Project description:"
                    ) ||
                    "No description";


                let progress =
                    Number(
                        prompt(
                            "Progress (0-100):",
                            "0"
                        )
                    );


                if (
                    isNaN(progress) ||
                    progress < 0 ||
                    progress > 100
                ) {

                    progress = 0;

                }


                projects.push({

                    id: Date.now(),

                    name: name,

                    description: description,

                    progress: progress,

                    createdAt:
                        new Date().toISOString()

                });


                saveData();

                renderProjects();

                addActivity(
                    `Created project "${name}"`
                );

            }
        );

    }


    // ==========================================
    // EDIT PROJECT
    // ==========================================

    window.editProject =
        function(id) {

            const project =
                projects.find(
                    p => p.id === id
                );

            if (!project) return;


            const name =
                prompt(
                    "Project name:",
                    project.name
                );

            if (!name) return;


            const description =
                prompt(
                    "Description:",
                    project.description
                );


            let progress =
                Number(
                    prompt(
                        "Progress (0-100):",
                        project.progress
                    )
                );


            if (isNaN(progress)) {

                progress =
                    project.progress;

            }


            project.name =
                name;

            project.description =
                description ||
                project.description;

            project.progress =
                Math.max(
                    0,
                    Math.min(
                        100,
                        progress
                    )
                );


            saveData();

            renderProjects();

            addActivity(
                `Updated project "${name}"`
            );

        };


    // ==========================================
    // DELETE PROJECT
    // ==========================================

    window.deleteProject =
        function(id) {

            const project =
                projects.find(
                    p => p.id === id
                );

            if (!project) return;


            if (
                !confirm(
                    `Delete "${project.name}"?`
                )
            ) return;


            projects =
                projects.filter(
                    p => p.id !== id
                );


            saveData();

            renderProjects();

            addActivity(
                `Deleted project "${project.name}"`
            );

        };


    // ==========================================
    // PROJECT SEARCH / FILTER
    // ==========================================

    const projectSearch =
        document.getElementById(
            "projectSearch"
        );


    const projectFilter =
        document.getElementById(
            "projectFilter"
        );


    if (projectSearch) {

        projectSearch.addEventListener(
            "input",
            renderProjects
        );

    }


    if (projectFilter) {

        projectFilter.addEventListener(
            "change",
            renderProjects
        );

    }


    // ==========================================
    // PROJECT PROGRESS
    // ==========================================

    function renderProjectProgress() {

        const container =
            document.getElementById(
                "projectProgressChart"
            );

        if (!container) return;


        if (projects.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <div>
                        📊
                    </div>

                    <h3>
                        No project data
                    </h3>

                    <p>
                        Create a project to see progress statistics.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            projects.slice(0, 6)
                .map(project => `

                    <div class="project-progress-item">

                        <div class="project-progress-header">

                            <strong>
                                ${escapeHTML(project.name)}
                            </strong>

                            <span>
                                ${project.progress}%
                            </span>

                        </div>

                        <div class="project-progress-bar">

                            <div
                                class="project-progress-fill"
                                style="width:${project.progress}%"
                            ></div>

                        </div>

                    </div>

                `).join("");
    }


    // ==========================================
    // TASKS
    // ==========================================

    function renderTasks() {

        if (!tasksContainer) return;


        const filter =
            document.getElementById(
                "taskFilter"
            );


        const filterValue =
            filter
                ? filter.value
                : "all";


        const filtered =
            tasks.filter(task => {

                if (
                    filterValue === "completed"
                ) {

                    return task.completed;

                }


                if (
                    filterValue === "active"
                ) {

                    return !task.completed;

                }


                return true;

            });


        if (filtered.length === 0) {

            tasksContainer.innerHTML = `

                <div class="empty-state">

                    <div>
                        ✓
                    </div>

                    <h3>
                        No tasks yet
                    </h3>

                    <p>
                        Add your first task to start working.
                    </p>

                </div>

            `;

            return;

        }


        tasksContainer.innerHTML =
            filtered.map(task => `

                <div class="task">

                    <input
                        type="checkbox"
                        class="task-checkbox"
                        ${
                            task.completed
                                ? "checked"
                                : ""
                        }
                        onchange="
                            toggleTask(${task.id})
                        "
                    >

                    <span
                        style="
                            ${
                                task.completed
                                    ? "text-decoration:line-through;opacity:0.5;"
                                    : ""
                            }
                        "
                    >
                        ${escapeHTML(task.name)}
                    </span>

                    <button
                        class="delete-button"
                        onclick="
                            deleteTask(${task.id})
                        "
                    >
                        Delete
                    </button>

                </div>

            `).join("");


        updateStatistics();
    }


    // ==========================================
    // ADD TASK
    // ==========================================

    const addTaskButton =
        document.getElementById(
            "addTaskButton"
        );


    if (addTaskButton) {

        addTaskButton.addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Task name:"
                    );

                if (!name) return;


                tasks.push({

                    id: Date.now(),

                    name: name,

                    completed: false,

                    createdAt:
                        new Date().toISOString()

                });


                saveData();

                renderTasks();

                addActivity(
                    `Created task "${name}"`
                );

            }
        );

    }


    // ==========================================
    // TOGGLE TASK
    // ==========================================

    window.toggleTask =
        function(id) {

            const task =
                tasks.find(
                    t => t.id === id
                );

            if (!task) return;


            task.completed =
                !task.completed;


            if (task.completed) {

                task.completedAt =
                    new Date().toISOString();

            } else {

                delete task.completedAt;

            }


            saveData();

            renderTasks();

            updateStatistics();

            addActivity(
                task.completed
                    ? `Completed task "${task.name}"`
                    : `Reopened task "${task.name}"`
            );

        };


    // ==========================================
    // DELETE TASK
    // ==========================================

    window.deleteTask =
        function(id) {

            const task =
                tasks.find(
                    t => t.id === id
                );

            if (!task) return;


            tasks =
                tasks.filter(
                    t => t.id !== id
                );


            saveData();

            renderTasks();

            updateStatistics();

            addActivity(
                `Deleted task "${task.name}"`
            );

        };


    const taskFilter =
        document.getElementById(
            "taskFilter"
        );


    if (taskFilter) {

        taskFilter.addEventListener(
            "change",
            renderTasks
        );

    }


    // ==========================================
    // SKILLS
    // ==========================================

    function renderSkills() {

        if (!skillsContainer) return;


        if (skills.length === 0) {

            skillsContainer.innerHTML = `

                <div class="empty-state">

                    <div>
                        🧠
                    </div>

                    <h3>
                        No skills yet
                    </h3>

                    <p>
                        Add your skills to track your progress.
                    </p>

                </div>

            `;

            return;

        }


        skillsContainer.innerHTML =
            skills.map(skill => `

                <div class="skill">

                    <div class="skill-header">

                        <span>
                            ${escapeHTML(skill.name)}
                        </span>

                        <strong>
                            ${skill.level}%
                        </strong>

                    </div>

                    <div class="skill-bar">

                        <div
                            class="skill-progress"
                            style="
                                width:${skill.level}%
                            "
                        ></div>

                    </div>

                </div>

            `).join("");
    }


    // ==========================================
    // ADD SKILL
    // ==========================================

    const addSkillButton =
        document.getElementById(
            "addSkillButton"
        );


    if (addSkillButton) {

        addSkillButton.addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Skill name:"
                    );

                if (!name) return;


                let level =
                    Number(
                        prompt(
                            "Skill level (0-100):",
                            "50"
                        )
                    );


                if (
                    isNaN(level) ||
                    level < 0 ||
                    level > 100
                ) {

                    level = 50;

                }


                skills.push({

                    id: Date.now(),

                    name: name,

                    level: level

                });


                saveData();

                renderSkills();

                addActivity(
                    `Added skill "${name}"`
                );

            }
        );

    }


    // ==========================================
    // GOALS
    // ==========================================

    function renderGoals() {

        if (!goalsContainer) return;


        if (goals.length === 0) {

            goalsContainer.innerHTML = `

                <div class="empty-state">

                    <div>
                        🎯
                    </div>

                    <h3>
                        No goals yet
                    </h3>

                    <p>
                        Add your first goal to track your progress.
                    </p>

                </div>

            `;

            return;

        }


        goalsContainer.innerHTML =
            goals.map(goal => `

                <div class="goal-card">

                    <div class="goal-header">

                        <h3>
                            ${escapeHTML(goal.name)}
                        </h3>

                        <span>
                            ${goal.progress}%
                        </span>

                    </div>

                    <p>
                        ${escapeHTML(goal.description)}
                    </p>

                    <div class="progress-bar">

                        <div
                            class="progress"
                            style="
                                width:${goal.progress}%
                            "
                        ></div>

                    </div>

                </div>

            `).join("");
    }


    // ==========================================
    // ADD GOAL
    // ==========================================

    const addGoalButton =
        document.getElementById(
            "addGoalButton"
        );


    if (addGoalButton) {

        addGoalButton.addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Goal name:"
                    );

                if (!name) return;


                const description =
                    prompt(
                        "Goal description:"
                    ) ||
                    "No description";


                let progress =
                    Number(
                        prompt(
                            "Progress (0-100):",
                            "0"
                        )
                    );


                if (
                    isNaN(progress) ||
                    progress < 0 ||
                    progress > 100
                ) {

                    progress = 0;

                }


                goals.push({

                    id: Date.now(),

                    name: name,

                    description: description,

                    progress: progress

                });


                saveData();

                renderGoals();

                addActivity(
                    `Created goal "${name}"`
                );

            }
        );

    }


    // ==========================================
    // REAL STATISTICS
    // ==========================================

    function updateStatistics() {

        const totalProjects =
            projects.length;


        const completedProjectCount =
            projects.filter(
                p => p.progress >= 100
            ).length;


        const totalTasks =
            tasks.length;


        const completedTaskCount =
            tasks.filter(
                t => t.completed
            ).length;


        const completionRate =
            totalTasks === 0
                ? 0
                : Math.round(
                    (
                        completedTaskCount /
                        totalTasks
                    ) * 100
                );


        if (projectCount) {

            projectCount.textContent =
                totalProjects;

        }


        if (completedTasks) {

            completedTasks.textContent =
                completedTaskCount;

        }


        if (taskCompletionText) {

            taskCompletionText.textContent =
                `${completionRate}% completion`;

        }


        const now =
            new Date();


        const thisMonth =
            projects.filter(project => {

                const date =
                    new Date(
                        project.createdAt
                    );

                return (
                    date.getMonth() ===
                    now.getMonth() &&

                    date.getFullYear() ===
                    now.getFullYear()
                );

            }).length;


        if (monthlyProjects) {

            monthlyProjects.textContent =
                thisMonth;

        }


        if (projectGrowth) {

            projectGrowth.textContent =
                `${thisMonth} this month`;

        }


        const monthTasks =
            tasks.filter(task => {

                if (!task.completed) {
                    return false;
                }

                if (!task.completedAt) {
                    return false;
                }

                const date =
                    new Date(
                        task.completedAt
                    );

                return (
                    date.getMonth() ===
                    now.getMonth() &&

                    date.getFullYear() ===
                    now.getFullYear()
                );

            }).length;


        if (monthlyTasks) {

            monthlyTasks.textContent =
                monthTasks;

        }


        const detailProjects =
            document.getElementById(
                "detailProjects"
            );

        const detailCompletedProjects =
            document.getElementById(
                "detailCompletedProjects"
            );

        const detailTasks =
            document.getElementById(
                "detailTasks"
            );

        const detailCompletedTasks =
            document.getElementById(
                "detailCompletedTasks"
            );

        const detailSkills =
            document.getElementById(
                "detailSkills"
            );

        const detailGoals =
            document.getElementById(
                "detailGoals"
            );


        if (detailProjects)
            detailProjects.textContent =
                totalProjects;


        if (detailCompletedProjects)
            detailCompletedProjects.textContent =
                completedProjectCount;


        if (detailTasks)
            detailTasks.textContent =
                totalTasks;


        if (detailCompletedTasks)
            detailCompletedTasks.textContent =
                completedTaskCount;


        if (detailSkills)
            detailSkills.textContent =
                skills.length;


        if (detailGoals)
            detailGoals.textContent =
                goals.filter(
                    g => g.progress >= 100
                ).length;


        const donutPercentage =
            document.getElementById(
                "donutPercentage"
            );

        const donutCompleted =
            document.getElementById(
                "donutCompleted"
            );

        const donutActive =
            document.getElementById(
                "donutActive"
            );

        const donutTotal =
            document.getElementById(
                "donutTotal"
            );

        const taskDonut =
            document.getElementById(
                "taskDonut"
            );


        if (donutPercentage)
            donutPercentage.textContent =
                `${completionRate}%`;


        if (donutCompleted)
            donutCompleted.textContent =
                completedTaskCount;


        if (donutActive)
            donutActive.textContent =
                totalTasks -
                completedTaskCount;


        if (donutTotal)
            donutTotal.textContent =
                totalTasks;


        if (taskDonut) {

            const degree =
                completionRate * 3.6;


            taskDonut.style.background =
                `conic-gradient(
                    #4f8cff 0deg,
                    #4f8cff ${degree}deg,
                    #252d3d ${degree}deg,
                    #252d3d 360deg
                )`;

        }


        updateCodingStatistics();

        updateStreak();

    }


    // ==========================================
    // CODING TIMER
    // ==========================================

    let timerSeconds = 0;

    let timerInterval = null;

    let timerRunning = false;


    const timerDisplay =
        document.getElementById(
            "timerDisplay"
        );


    const startTimerButton =
        document.getElementById(
            "startTimerButton"
        );


    const stopTimerButton =
        document.getElementById(
            "stopTimerButton"
        );


    function updateTimerDisplay() {

        const hours =
            Math.floor(
                timerSeconds / 3600
            );


        const minutes =
            Math.floor(
                (timerSeconds % 3600) / 60
            );


        const seconds =
            timerSeconds % 60;


        if (timerDisplay) {

            timerDisplay.textContent =

                String(hours)
                    .padStart(2, "0")

                + ":" +

                String(minutes)
                    .padStart(2, "0")

                + ":" +

                String(seconds)
                    .padStart(2, "0");

        }

    }


    if (startTimerButton) {

        startTimerButton.addEventListener(
            "click",
            () => {

                if (timerRunning) return;


                timerRunning = true;


                timerInterval =
                    setInterval(
                        () => {

                            timerSeconds++;

                            updateTimerDisplay();

                        },
                        1000
                    );


                startTimerButton.textContent =
                    "Running...";


                addActivity(
                    "Started coding timer"
                );

            }
        );

    }


    if (stopTimerButton) {

        stopTimerButton.addEventListener(
            "click",
            () => {

                if (!timerRunning) return;


                clearInterval(
                    timerInterval
                );


                timerRunning = false;


                if (timerSeconds > 0) {

                    codingSessions.push({

                        date:
                            new Date()
                                .toISOString(),

                        seconds:
                            timerSeconds

                    });

                }


                timerSeconds = 0;


                saveData();

                updateTimerDisplay();

                updateStatistics();


                if (startTimerButton) {

                    startTimerButton.textContent =
                        "Start";

                }


                addActivity(
                    "Finished a coding session"
                );

            }
        );

    }


    // ==========================================
    // CODING STATISTICS
    // ==========================================

    function getTotalCodingSeconds() {

        return codingSessions.reduce(
            (
                total,
                session
            ) => {

                return total +
                    session.seconds;

            },
            0
        );

    }


    function getCodingSecondsSince(days) {

        const now =
            new Date();


        const limit =
            new Date(
                now.getTime() -
                days *
                24 *
                60 *
                60 *
                1000
            );


        return codingSessions
            .filter(
                session =>
                    new Date(
                        session.date
                    ) >= limit
            )
            .reduce(
                (
                    total,
                    session
                ) =>
                    total +
                    session.seconds,
                0
            );

    }


    function updateCodingStatistics() {

        const totalSeconds =
            getTotalCodingSeconds();


        const weekSeconds =
            getCodingSecondsSince(7);


        const monthSeconds =
            getCodingSecondsSince(30);


        const totalHours =
            Math.floor(
                totalSeconds / 3600
            );


        const weekHours =
            (
                weekSeconds / 3600
            ).toFixed(1);


        const monthHours =
            (
                monthSeconds / 3600
            ).toFixed(1);


        if (codingHours) {

            codingHours.textContent =
                `${totalHours}h`;

        }


        if (weeklyCoding) {

            weeklyCoding.textContent =
                `${weekHours}h this week`;

        }


        if (monthlyCodingHours) {

            monthlyCodingHours.textContent =
                `${monthHours}h`;

        }


        renderCodingChart();

    }


    // ==========================================
    // CODING CHART
    // ==========================================

    function renderCodingChart() {

        const chart =
            document.getElementById(
                "codingChart"
            );


        if (!chart) return;


        chart.innerHTML = "";


        const today =
            new Date();


        const days = [];


        for (
            let i = 6;
            i >= 0;
            i--
        ) {

            const date =
                new Date(
                    today
                        .getTime() -
                    i *
                    24 *
                    60 *
                    60 *
                    1000
                );


            days.push(date);

        }


        days.forEach(date => {

            const dateString =
                date.toISOString()
                    .split("T")[0];


            const seconds =
                codingSessions
                    .filter(
                        session =>
                            session.date
                                .startsWith(
                                    dateString
                                )
                    )
                    .reduce(
                        (
                            total,
                            session
                        ) =>
                            total +
                            session.seconds,
                        0
                    );


            const hours =
                seconds / 3600;


            const height =
                Math.min(
                    100,
                    Math.max(
                        3,
                        hours / 8 * 100
                    )
                );


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "chart-bar-wrapper";


            wrapper.innerHTML = `

                <div
                    class="chart-bar"
                    style="height:${height}%"
                    title="${hours.toFixed(1)} hours"
                ></div>

                <span class="chart-day">
                    ${date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short"
                        }
                    )}
                </span>

            `;


            chart.appendChild(
                wrapper
            );

        });

    }


    // ==========================================
    // STREAK
    // ==========================================

    function updateStreak() {

        const activeDates =
            new Set();


        codingSessions.forEach(
            session => {

                activeDates.add(
                    session.date
                        .split("T")[0]
                );

            }
        );


        tasks.forEach(task => {

            if (
                task.completed &&
                task.completedAt
            ) {

                activeDates.add(
                    task.completedAt
                        .split("T")[0]
                );

            }

        });


        let streak = 0;

        let checkDate =
            new Date();


        while (true) {

            const dateString =
                checkDate
                    .toISOString()
                    .split("T")[0];


            if (
                activeDates.has(
                    dateString
                )
            ) {

                streak++;

                checkDate.setDate(
                    checkDate.getDate() - 1
                );

            } else {

                break;

            }

        }


        if (currentStreak) {

            currentStreak.textContent =
                streak;

        }


        if (longestStreak) {

            longestStreak.textContent =
                `Current: ${streak} days`;

        }

    }


    // ==========================================
    // CLEAR ALL DATA
    // ==========================================

    const clearDataButton =
        document.getElementById(
            "clearDataButton"
        );


    if (clearDataButton) {

        clearDataButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to delete ALL dashboard data? This cannot be undone."
                    );


                if (!confirmed) return;


                localStorage.removeItem(
                    "dev_projects"
                );

                localStorage.removeItem(
                    "dev_tasks"
                );

                localStorage.removeItem(
                    "dev_skills"
                );

                localStorage.removeItem(
                    "dev_goals"
                );

                localStorage.removeItem(
                    "dev_activities"
                );

                localStorage.removeItem(
                    "dev_coding_sessions"
                );


                projects = [];

                tasks = [];

                skills = [];

                goals = [];

                activities = [];

                codingSessions = [];


                if (timerInterval) {

                    clearInterval(
                        timerInterval
                    );

                }


                timerSeconds = 0;

                timerRunning = false;


                renderProjects();

                renderTasks();

                renderSkills();

                renderGoals();

                renderActivities();

                updateStatistics();

                updateTimerDisplay();

                renderCodingChart();


                if (startTimerButton) {

                    startTimerButton.textContent =
                        "Start";

                }


                alert(
                    "All dashboard data has been cleared successfully!"
                );

            }
        );

    }


    // ==========================================
    // THEME
    // ==========================================

    const themeButton =
        document.getElementById(
            "themeButton"
        );


    const settingsThemeButton =
        document.getElementById(
            "settingsThemeButton"
        );


    const themeIcon =
        document.getElementById(
            "themeIcon"
        );


    function toggleTheme() {

        document.body.classList.toggle(
            "light-theme"
        );


        const isLight =
            document.body.classList.contains(
                "light-theme"
            );


        localStorage.setItem(
            "dev_theme",
            isLight
                ? "light"
                : "dark"
        );


        if (themeIcon) {

            themeIcon.textContent =
                isLight
                    ? "☀"
                    : "☾";

        }

    }


    const savedTheme =
        localStorage.getItem(
            "dev_theme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            toggleTheme
        );

    }


    if (settingsThemeButton) {

        settingsThemeButton.addEventListener(
            "click",
            toggleTheme
        );

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            text;

        return div.innerHTML;

    }


    // ==========================================
    // INITIAL RENDER
    // ==========================================

    renderProjects();

    renderTasks();

    renderSkills();

    renderGoals();

    renderActivities();

    renderProjectProgress();

    updateStatistics();

    updateTimerDisplay();

});