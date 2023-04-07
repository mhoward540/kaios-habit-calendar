import { createSignal, Component, onMount, Show } from "solid-js";
import { useCalendarData } from "./CalendarDataProvider";

const DEFAULT_MESSAGE =
  "Type the name of your habit here! Come back every day to track it";

const InternalAddHabitPopup: Component = () => {
  const [message, setMessage] = createSignal(DEFAULT_MESSAGE);
  const {
    habits: {
      addHabit,
      habitList,
      setShouldShowAddHabitPopup,
      setSelectedHabit,
    },
  } = useCalendarData();

  onMount(() => {
    let newHabitName = "";
    let isInvalid = true;

    for (let i = 0; i < 3; i++) {
      newHabitName = prompt(message()) || "";
      isInvalid = !newHabitName || habitList().includes(newHabitName);
      if (isInvalid) {
        const infix = !newHabitName ? "empty" : "existing";
        setMessage(`You've entered an ${infix} habit name, please try again`);
      } else {
        break;
      }
    }

    // happy case
    if (!isInvalid) {
      addHabit(newHabitName);
      setShouldShowAddHabitPopup(false);
      setSelectedHabit(newHabitName);
      return;
    }

    if (habitList().length === 0) {
      window.close();
    }

    setSelectedHabit(habitList()[0]);
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
