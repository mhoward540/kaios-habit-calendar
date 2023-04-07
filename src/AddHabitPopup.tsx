import { createSignal, Component, onMount, Show } from "solid-js";
import { useCalendarData } from "./CalendarDataProvider";

const DEFAULT_MESSAGE =
  "Type the name of your habit here! Come back every day to track it";

const InternalAddHabitPopup: Component = () => {
  const [message, setMessage] = createSignal(DEFAULT_MESSAGE);
  const {
    habits: { addHabit, habitList, setShouldShowAddHabitPopup },
  } = useCalendarData();

  onMount(() => {
    let newHabitName: string = "";
    do {
      newHabitName = prompt(message()) || "";
      const infix = !newHabitName ? "empty" : "existing";
      setMessage(`You've entered an ${infix} habit name, please try again`);
    } while (!newHabitName || habitList().includes(newHabitName));

    addHabit(newHabitName);
    setShouldShowAddHabitPopup(false);
  });

  return <></>;
};

const AddHabitPopup: Component = () => {
  const {
    habits: { shouldShowAddHabitPopup },
  } = useCalendarData();
  return (
    <Show when={shouldShowAddHabitPopup()} fallback={<></>}>
      <InternalAddHabitPopup />
    </Show>
  );
};

export default AddHabitPopup;
