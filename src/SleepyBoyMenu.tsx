import type {Component} from 'solid-js';
import {createEffect, createSignal, For, onMount} from "solid-js";
import cx from 'classnames';


export interface BasicMenuItem {
    name: string
}

export interface ActionMenuItem {
    name: string
    handler: () => any
}

// Opens a menu when selected
export interface SubMenuItem {
    name: string,
    submenu: Menu,
}

type MenuSelectEvent = Event & { currentTarget: HTMLSelectElement, target: Element }

// TODO maybe turn this into a component instead?
export interface Menu {
    items: (BasicMenuItem | ActionMenuItem | SubMenuItem)[],
    handleBasicItem?: (item: BasicMenuItem) => any
}

interface Props {
    menu: Menu,
    handleClose: () => void
}

const isSubMenuItem = (item: BasicMenuItem | ActionMenuItem | SubMenuItem): item is SubMenuItem => {
    return item.hasOwnProperty("submenu")
}

const isActionMenuItem = (item: BasicMenuItem | ActionMenuItem | SubMenuItem): item is ActionMenuItem => {
    return item.hasOwnProperty("handler")
}

const SleepyBoyMenu: Component<Props> = (props) => {
    const [currMenu, setCurrMenu] = createSignal(props.menu);
    // const [isCurrentlyOpen, setIsCurrentlyOpen] = createSignal(props.isOpen)
    let menuRef: HTMLSelectElement | undefined;
    let receptacleRef: HTMLDivElement | undefined;

    const nameToTypeMapping = () => currMenu().items.reduce(
        (acc, curr) => {
            acc[curr.name] = curr
            return acc
        },
        {} as { [key: string]: BasicMenuItem | ActionMenuItem | SubMenuItem }
    )

    const handleClose = () => {
        setCurrMenu(props.menu)
        props.handleClose()
    }

    const openMenu = () => {
        if (!menuRef) {
            return
        }
        console.log("his name is oneeee piece")
        receptacleRef?.focus()
        setTimeout(() => {
            if (menuRef) {
                menuRef.focus()
                menuRef.value = ""
            }
        }, 50)
    }

    onMount(() => {
        openMenu()
        menuRef?.addEventListener("blur", () => {
            if (document.activeElement !== receptacleRef) {
                console.log("whoopdy doo:")
                console.log(document.activeElement)
                handleClose()
            }
        })
    })

    const handleMenuSelect = (e: MenuSelectEvent) => {
        console.log("hitsss bb")
        const selectedMenuItem = nameToTypeMapping()[e.currentTarget.value];
        // the problem is that we can't distinguish between a blur which cancels the select and a blur which selects a submenu
        // we probably need to check which input the event is happening on or something hacky like that
        if (isSubMenuItem(selectedMenuItem)) {
            setCurrMenu(selectedMenuItem.submenu)
            console.log("mmm bop")
            openMenu()
        } else if (isActionMenuItem(selectedMenuItem)) {
            selectedMenuItem.handler()
            handleClose()
        } else {
            currMenu().handleBasicItem?.(selectedMenuItem)
            setCurrMenu(props.menu)
            handleClose()
        }
    }

    return (
        <div class={cx("w-0", "h-0", "SleepyBoyMenu")}>
            <select value="" class={cx("w-0", "h-0", "SleepyBoyMenuSelect")} ref={menuRef} onChange={(e) => handleMenuSelect(e)}>
                <For each={currMenu().items}>
                    {(item) => (
                        <option class="w-0 h-0">{item.name}</option>
                    )}
                </For>
            </select>
            <div class={cx("w-0", "h-0", "FocusReceptacle")} ref={receptacleRef}></div>
        </div>
    )

}

export default SleepyBoyMenu;
