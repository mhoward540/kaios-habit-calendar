import type { Component } from "solid-js";
import styles from "./App.module.css";
import HabitCalendar from "./HabitCalendar";
import CalendarControls from "./CalendarControls";
import AppHeader from "./AppHeader";
import Softkeys from "./Softkeys";
import { CalendarDataProvider } from "./CalendarDataProvider";
import AddHabitPopup from "./AddHabitPopup";

const App: Component = () => {
  const todaysDate = new Date();
  const displayMonth = new Date(
    todaysDate.getFullYear(),
    todaysDate.getMonth(),
    1
  );

  return (
    <div class={styles.MainApp}>
      <CalendarDataProvider initialDate={displayMonth}>
        <div id="header">
          <AppHeader />
        </div>
        <div id="content">
          <div class={styles.CalendarControlsContainer}>
            <CalendarControls />
          </div>
          <div class={styles.HabitCalendarContainer}>
            <HabitCalendar />
          </div>
        </div>
        <AddHabitPopup />
        <Softkeys />
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
