class DataManager {
    constructor(storageKey = "progressData") {
        this.storageKey = storageKey;
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
}
