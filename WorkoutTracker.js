export default class WorkoutTracker{
    constructor(root){
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
        this.entries = [];
        
        this.loadEntries();
        this.updateView();

        this.root.querySelector(".tracker_add").addEventListener('click', () =>{
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDay().toString().padStart(2, "0");

            this.addEntry({
                date: `${ year }-${ month }-${ day }`,
                workout: "running",
                duration: 30
            });
        });
    }

    static html(){
        return `
            <table class="tracker">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Workout</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
                <tbody>
                    <tr class="tracker_row tracker_row-add">
                        <td colspan="4">
                            <span class="tracker_add">Add Entry &plus;</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    static rowHtml(){
        return `
            <tr class="tracker_row">
                <td>
                    <input type="date" class="tracker_date" />
                </td>
                <td>
                    <select class="tracker_workout">
                        <option value="walking">Walking</opion>
                        <option value="running">Running</option>
                        <option value="outdoor-cycling">Outdoor Cycling</option>
                        <option value="indoor-cycling">Indoor Cycling</option>
                        <option value="swimming">Swimming</option>
                        <option value="yoga">Yoga</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="tracker_duration" />
                    <span class="tracker_text">minutes</span>
                </td>
                <td>
                    <button type="button" class="tracker_delete">&times;</button>
                </td>
            </tr>
        `;
    }

    loadEntries(){
        this.entries = JSON.parse(localStorage.getItem("workout-tracker-entries") || "[]");
    }

    saveEntries(){
        localStorage.setItem("workout-tracker-entries", JSON.stringify(this.entries));
    }

    updateView(){
        const tableBody = this.root.querySelector(".entries");
        const addRow = data => {
            const template = document.createElement("template");
            let row = null;

            template.innerHTML = WorkoutTracker.rowHtml().trim();
            row = template.content.firstElementChild;

            row.querySelector(".tracker_date").value = data.date;
            row.querySelector(".tracker_workout").value = data.workout;
            row.querySelector(".tracker_duration").value = data.duration;

            //TODO: add events for input changing
            row.querySelector(".tracker_date").addEventListener("change", ({target}) =>{
                data.date = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker_workout").addEventListener("change", ({target}) =>{
                data.workout = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker_duration").addEventListener("change", ({target}) =>{
                data.duration = target.value;
                this.saveEntries();
            });

            //TODO: add event to delete the row
            row.querySelector(".tracker_delete").addEventListener('click', () =>{
                this.deleteEntry(data);
            });

            tableBody.appendChild(row);
        };

        tableBody.querySelectorAll(".tracker_row").forEach(row =>{
            row.remove();
        });
        this.entries.forEach(data => addRow(data));
    }
    addEntry(data){
        this.entries.push(data);
        this.saveEntries();
        this.updateView();
    }
    deleteEntry(dataToDelete){
        this.entries = this.entries.filter(data => data !== dataToDelete);
        this.saveEntries();
        this.updateView();
    }
}