import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TreeViewComponent } from './tree-view.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, TreeViewComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
