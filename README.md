# UtccEconDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

## Installation Notes

* Make sure ChartDataService is included in providers in the application module.

* Install material design:
1. npm install --save @angular/material @angular/cdk @angular/animations
2. import BrowserAnimationsModule module into application module (animation support)
      import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
3. import angular material modules 
      import {MatCardModule} from '@angular/material/card'; etc...
4. add theme to styles.css 
      @import "~@angular/material/prebuilt-themes/indigo-pink.css";
5. install hammerjs (npm install --save hammerjs) and add it to src/main.ts (import 'hammerjs';)
6. add link in index.html for material icons
      >link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

* Install Angular Flex layout (this may cause problems because of version used, might need to remove the code in project to accomodate)
1. npm install @angular/flex-layout --save
2. import flexlayout module
    import { FlexLayoutModule } from '@angular/flex-layout'
    
* Install muuri grid:
1. npm install --save muuri
2. install hammerjs (npm install --save hammerjs) and add it to src/main.ts (import 'hammerjs';)
3. install web animations (npm install --save web-animations-js) and add it to src/main.ts (import 'web-animations-js')


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
