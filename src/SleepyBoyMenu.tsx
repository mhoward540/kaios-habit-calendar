import type { Component } from "solid-js";
import { createSignal, For, onMount } from "solid-js";
import cx from "classnames";

export interface ActionMenuItem {
  name: string;
  value: string;
  handler: () => any;
}

type MenuSelectEvent = Event & {
  currentTarget: HTMLSelectElement;
  target: Element;
};

// TODO maybe turn this into a component instead?
// TODO try optgroups?
export interface Menu {
  items: ActionMenuItem[];
}

interface Props {
  menu: Menu;
  handleClose: () => void;
  selected: string;
}

// Too sleepy to make my own menu component, just gonna hack around, use the built-in KaiOS behavior
// for a select input and bring focus to it when needed
const SleepyBoyMenu: Component<Props> = (props) => {
  // const [isCurrentlyOpen, setIsCurrentlyOpen] = createSignal(props.isOpen)
  let menuRef: HTMLSelectElement | undefined;
  let receptacleRef: HTMLDivElement | undefined;

  const nameToTypeMapping = () =>
    props.menu.items.reduce((acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    }, {} as { [key: string]: ActionMenuItem });

  const handleClose = () => {
    props.handleClose();
  };

  const openMenu = () => {
    if (!menuRef) {
      return;
    }
    receptacleRef?.focus();
    setTimeout(() => {
      if (menuRef) {
        menuRef.focus();
        menuRef.value = "";
      }
    }, 50);
  };

  onMount(() => {
    openMenu();
    menuRef?.addEventListener("blur", () => {
      if (document.activeElement !== receptacleRef) {
        handleClose();
      }
    });
  });

  const handleMenuSelect = (e: MenuSelectEvent) => {
    console.log("hitsss bb");
    const selectedMenuItem = nameToTypeMapping()[e.currentTarget.value];
    // the problem is that we can't distinguish between a blur which cancels the select and a blur which selects a submenu
    // we probably need to check which input the event is happening on or something hacky like that
    selectedMenuItem.handler();
    handleClose();
  };

  return (
    <div class={cx("w-0", "h-0", "SleepyBoyMenu")}>
      <select
        class={cx("w-0", "h-0", "SleepyBoyMenuSelect")}
        ref={menuRef}
        onChange={(e) => handleMenuSelect(e)}
      >
        <For each={props.menu.items}>
          {(item) => (
            <option selected={item.value === props.selected} class="w-0 h-0">
              {item.name}
            </option>
          )}
        </For>
      </select>
      <div
        class={cx("w-0", "h-0", "FocusReceptacle")}
        ref={receptacleRef}
      ></div>
    </div>
  );
};

export default SleepyBoyMenu;
