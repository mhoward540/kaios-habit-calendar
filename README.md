# kaios-habit-calendar

A simple habit calendar application for KaiOS, built with SolidJS using [this template](https://github.com/mhoward540/kaios-solidjs-starter). Mostly done to play around with SolidJS and KaiOS

### Features
- Calendar view to track habits day-by-day, and view your progression from the previous months
- Add/Delete an unlimited number of habits. Saved to localStorage - no internet connection needed (or used ever)
- Basic localization (using built-in `Intl`)

### Screenshots
![Main Calendar View](https://user-images.githubusercontent.com/3496280/230664483-58ef4971-2e12-4660-b91f-f60f776492c7.png)
![Delete a habit and other options](https://user-images.githubusercontent.com/3496280/230664478-acfd1be8-1608-49bc-9fd8-d0d34076fea5.png)
![Add a habit](https://user-images.githubusercontent.com/3496280/230664486-fbebe91b-cf05-42f1-b95d-9ac87e3c4495.png)

### Development and testing

`yarn dev` builds the app in watch mode and serves the site. Great for testing your app in a desktop browser.

### Deploying to a device
This app is not (yet?) available in the KaiOS store so it needs to be imported via WebIDE

1. Connect your device to your computer and make sure it appears in WebIDE.
2. `yarn build`
3. In WebIDE, load the `/public` folder as a packaged app.

## Credit
Some hooks copied from:
https://github.com/NukeJS/solidjs-hooks

Some CSS/JS for KaiOS styling from:
https://github.com/canicjusz/KaiOS-native-UI

Agenda icons created by Saepul Nahwan - Flaticon
https://www.flaticon.com/free-icons/agenda

See the [original template](https://github.com/mhoward540/kaios-solidjs-starter) for more acknowledgements
