const tasks = [
    {
        _id: '5d2ca9e2e03d40b326596aa7',
        completed: true,
        body:
            'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: 'Eu ea incididunt sunt consectetur fugiat non.',
    },
    {
        _id: '5d2ca9e29c8a94095c1288e0',
        completed: false,
        body:
            'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
        title:
            'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
    },
    {
        _id: '5d2ca9e2e03d40b3232496aa7',
        completed: true,
        body:
            'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: 'Eu ea incididunt sunt consectetur fugiat non.',
    },
    {
        _id: '5d2ca9e29c8a94095564788e0',
        completed: false,
        body:
            'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
        title:
            'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
    }
];

(function (arrayOfTasks) {
    // UI
    const taskContainer = document.querySelector('.task-container'),
        tabContainer = document.querySelector('.tab-container'),
        form = document.forms['form'];

    let activeTab = document.querySelector('.active');

    /**
     * Function return object of tasks with key = task._id
     * @param tasks
     * @returns objOfTasks
     */
    function createObjectOfTasks(tasks) {
        const tasksData = localStorage.getItem('tasks');

        if (tasksData) {
            return JSON.parse(tasksData);
        }

        return tasks.reduce((acc, task) => {
            acc[task._id] = task;
            return acc;
        }, {})
    }

    let objOfTasks = createObjectOfTasks(arrayOfTasks);

    // Events
    form.addEventListener('submit', onSubmitHandler);

    taskContainer.addEventListener('click', taskContainerClickHandler);

    tabContainer.addEventListener('click', tabContainerClickHandler);

    /**
     * unload - when reload or reopen page
     */
    window.addEventListener('unload', () => {
        localStorage.setItem('tasks', JSON.stringify(objOfTasks));
    });

    /**
     * Form submit handler
     * @param e
     */
    function onSubmitHandler(e) {
        e.preventDefault();
        renderNewTask();
        this.reset();
    }

    /**
     * taskContainer click handler
     */
    function taskContainerClickHandler({target}) {
        const btnAttr = target.dataset.btn;
        if (btnAttr === 'delete') {
            deleteTask(target);
        } else {
            statusTask(target, btnAttr);
        }
    }

    /**
     * tabContainer click handler
     * @param target
     */
    function tabContainerClickHandler({target}) {
        if (!target.classList.contains('tab') || activeTab === target) {
            return;
        }
        activeTab = target;
        const currentTabModel = target.dataset.model;
        document.querySelectorAll(".tab").forEach(el => {
            if (el.dataset.model === currentTabModel) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        showTasksByTab(currentTabModel);
    }

    /**
     * Function filter tasks by tab name
     * @param currentTabModel
     */
    function showTasksByTab(currentTabModel) {
        const allTasks = document.querySelectorAll("li")
        if (!allTasks) {
            return;
        }
        if (currentTabModel === 'all') {
            showAllTasks(allTasks);
        } else {
            showIsCompletedTasks(allTasks, currentTabModel);
        }
    }

    /**
     * Show all tasks if tab is all
     * @param li
     */
    function showAllTasks(li) {
        li.forEach(el => el.classList.remove('hidden'));
    }

    /**
     * Show done or undone tasks for Done or Undone tab
     * @param li
     * @param attr
     */
    function showIsCompletedTasks(li, attr) {
        li.forEach(el => {
            el.classList.contains(attr) ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
    }

    /**
     * Render new task
     */
    function renderNewTask() {
        if (createNewTask()) {
            const newTask = createNewTask();
            objOfTasks[newTask._id] = newTask;
            taskContainer.insertAdjacentHTML('afterbegin', createListItem(newTask));
        }
    }

    /**
     * Create a new task
     * @returns newTask
     */
    function createNewTask() {
        const titleValue = form.elements['title'].value,
            descriptionValue = form.elements['description'].value;

        if (titleValue && descriptionValue) {
            return createNewObjOfTask(titleValue, descriptionValue);
        }
    }

    /**
     * Create new object of task
     * @param title
     * @param description
     * @returns newTask
     */
    function createNewObjOfTask(title, description) {
        return {
            _id: createUUID(),
            title,
            description,
            completed: false
        };
    }

    /**
     * Create UUID for new task id
     * @returns {string}
     */
    function createUUID() {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    renderAllTasks(objOfTasks);

    /**
     * Function renders objOfTasks
     * @param tasks
     */
    function renderAllTasks(tasks) {
        taskContainer.insertAdjacentHTML('afterbegin', createFragment(tasks));
    }

    /**
     * Prepare fragment for render
     * @param tasks
     * @returns fragment
     */
    function createFragment(tasks) {
        return Object.values(tasks).reduce((acc, task) => {
            acc += createListItem(task);
            return acc;
        }, '');
    }

    /**
     * Create template of tasks for insert into html
     * @param _id
     * @param title
     * @param completed
     * @param body
     * @returns {string}
     */
    function createListItem({_id, title, completed, body}) {
        const statusBtn = completed ? 'Undone' : 'Done';
        return `
            <li data-id=${_id} class=${completed ? "done" : "undone"}>
                <h2>${title}</h2>
                <p>${body}</p>
                <button data-btn="${completed ? "uncompleted" : "completed"}">${statusBtn}</button>
                <button data-btn="delete">Delete</button>
            </li>
        `
    }

    /**
     * Delete current task from HTML and objOfTasks
     * @param e
     */
    function deleteTask(target) {
        delete objOfTasks[getCurrentTaskId(target)];
        target.parentElement.remove();
    }

    /**
     * Change complete status, change done task to undone and vice versa
     * @param target
     */
    function statusTask(target, btnAttr) {
        if (btnAttr === 'uncompleted') {
            undoneToDone(target);
        } else {
            doneToUndone(target);
        }
    }

    /**
     * Get current task id
     * @param target
     * @returns {string | undefined}
     */
    function getCurrentTaskId(target) {
        return target.parentElement.dataset.id;
    }

    /**
     * Change undone to done
     * @param target
     */
    function undoneToDone(target) {
        const currentTaskId = getCurrentTaskId(target);
        if (currentTaskId) {
            objOfTasks[currentTaskId].completed = false;
            target.dataset.btn = 'completed';
            target.parentElement.className = 'undone';
            target.innerText = 'Done';
        }
        if (activeTab.dataset.model === 'done') {
            target.parentElement.classList.add('hidden');
        }
    }

    /**
     * Change done to undone
     * @param target
     */
    function doneToUndone(target) {
        const currentTaskId = getCurrentTaskId(target);
        if (currentTaskId) {
            objOfTasks[currentTaskId].completed = true;
            target.dataset.btn = 'uncompleted';
            target.parentElement.className = 'done';
            target.innerText = 'Undone';
        }
         if (activeTab.dataset.model === 'undone') {
            target.parentElement.classList.add('hidden');
        }
    }


})(tasks)