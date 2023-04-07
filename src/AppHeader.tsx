import {Component} from "solid-js";
import {useCalendarData} from "./CalendarDataProvider";

const AppHeader: Component = () => {
    const {habits: {selectedHabit}} = useCalendarData()

    return (
        <div class="w-full h-full text-center">
            {selectedHabit()}
        </div>
    );
}

export default AppHeader