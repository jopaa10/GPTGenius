## Create Next App

```sh
npx create-next-app@14 appName

```

In the starter project, TailwindCSS and DaisyUI are already installed and configured 👍

## DaisyUI

- remove default code from globals.css
  tailwind.config.js

```js
{
plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
```
