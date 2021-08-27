class VisitedService {

    getVisited() {
        const visited = localStorage.getItem("aether-venues-visited");
        if (visited === null) return [];
        return JSON.parse(visited);
    }

    isVisited(id) {
        return this.getVisited().indexOf(id) !== -1;
    }

    setVisited(id) {
        const favourites = this.getVisited();
        favourites.push(id);
        localStorage.setItem("aether-venues-visited", JSON.stringify(favourites));
        return favourites;
    }

    removeVisited(id) {
        const favourites = this.getVisited().filter(i => i !== id);
        localStorage.setItem("aether-venues-visited", JSON.stringify(favourites));
        return favourites;
    }

}

const visitedService = new VisitedService();

export { visitedService }