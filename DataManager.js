class DataManager {
    constructor(storageKey = "progressData", goalsKey = "exerciseGoals") {
        this.storageKey = storageKey;
        this.goalsKey = goalsKey;
    }

    saveEntry(exercise, entry) {
        let data = this.getEntries();
        if (!data[exercise]) {
            data[exercise] = [];
        }
        data[exercise].push(entry);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getEntries() {
        let data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    clearEntries(exercise) {
        let data = this.getEntries();
        if (exercise) {
            delete data[exercise];
        } else {
            data = {};
        }
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    saveGoal(exercise, goal) {
        let goals = this.getGoals();
        goals[exercise] = goal;
        localStorage.setItem(this.goalsKey, JSON.stringify(goals));
    }
    
    getGoals() {
        let goals = localStorage.getItem(this.goalsKey);
        return goals ? JSON.parse(goals) : {};
    }
    
    getGoal(exercise) {
        const goals = this.getGoals();
        return goals[exercise] || null;
    }
    
    removeGoal(exercise) {
        let goals = this.getGoals();
        if (goals[exercise]) {
            delete goals[exercise];
            localStorage.setItem(this.goalsKey, JSON.stringify(goals));
            return true;
        }
        return false;
    }
}
