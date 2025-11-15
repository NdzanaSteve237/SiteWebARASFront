// src/main.server.ts
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';

export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(AppComponent, config, context);
}
