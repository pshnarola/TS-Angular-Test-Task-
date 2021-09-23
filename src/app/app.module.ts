import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FreezeService, RowDDService, TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { PageService,FilterService,EditService,ToolbarService } from '@syncfusion/ej2-angular-treegrid';
import { SortService, ResizeService, ReorderService,ExcelExportService, PdfExportService, ContextMenuService } from '@syncfusion/ej2-angular-treegrid';
import {ButtonModule} from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeGridModule ,
    ButtonModule,
    DropDownListAllModule,
    DropDownListAllModule
  ],
  providers: [PageService,
    SortService,
    FilterService,
    EditService,
    FreezeService,
    SortService, ResizeService, 
    ExcelExportService, 
    PdfExportService, ContextMenuService,
    ToolbarService,ReorderService,RowDDService],
  bootstrap: [AppComponent]
})
export class AppModule { }
