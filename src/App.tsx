import type {Component} from 'solid-js';
import styles from './App.module.css';
import HabitCalendar from "./HabitCalendar";
import CalendarHeader from "./CalendarHeader";
import AppHeader from "./AppHeader";
import {CalendarDataProvider} from "./CalendarDataProvider";

const App: Component = () => {
    const todaysDate = new Date();
    const displayMonth = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1);

    return (
        <div class={styles.MainApp}>
            <CalendarDataProvider initialDate={displayMonth}>
                <div id="header">
                    <AppHeader/>
                </div>
                <div id='content'>
                    <div class={styles.CalendarHeaderContainer}>
                        <CalendarHeader/>
                    </div>
                    <div class={styles.HabitCalendarContainer}>
                        <HabitCalendar/>
                    </div>
                </div>
                {/*
          TODO there appears to be space for an ad down here even on low resolution devices.
            We can create a div and pass a ref to it from the provider. Then use KaiOS ads API. Sources:
            https://www.kaiads.com/publishers/sdk.html#responsive
            https://www.solidjs.com/tutorial/bindings_refs
        */}
            </CalendarDataProvider>
        </div>
    );
};

export default App;
