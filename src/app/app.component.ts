import { Component, ViewChild } from '@angular/core';
import { sampleData } from './datasource';
import { PageSettingsModel, EditSettingsModel, TreeGridComponent, Column,ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import _ from 'lodash';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public data: Object[];
  public pager;
  public contextMenuItems: Object[];
  isAllow: boolean = false;
  heightValue;
  public selectionOptions: SelectionSettingsModel;
  public editSettings: EditSettingsModel;
  public editOptions: Object;
  public elem: HTMLElement;
  public autoCompleteObj: AutoComplete;
  public frozenColumns: number = 0;
  public rowDrop: Object;
  isSort:boolean= true;
  columnIndex:number =0;
  copyObj:any=[];
  @ViewChild('treegrid', { static: false })
  public treeGridObj: TreeGridComponent;
  isAllSelected: boolean = false;
  isSelectRow:boolean=false;
  isPasteRow:boolean=false;
  isFreeze: boolean = false;
  showColumn:boolean= false;
  public initialSort: Object;
isMultiSort :boolean =false;
  ngOnInit(): void {
    this.data = sampleData;
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    this.editOptions = {
      create: () => {
        this.elem = document.createElement('input');
        return this.elem;
      },
      read: () => {
        return this.autoCompleteObj.value;
      },
      destroy: () => {
        this.autoCompleteObj.destroy();
      },
      write: (args: { rowData: Object, column: Column }) => {

        this.autoCompleteObj = new AutoComplete({
          dataSource: <{ key: string, value: any }[]>this.treeGridObj.grid.dataSource,
          fields: { value: 'taskName' },
          value: args.rowData[args.column.field]
        });
        this.autoCompleteObj.appendTo(this.elem);
      }
    };
    this.selectionOptions = { type: 'Multiple'};
   
    this.contextMenuItems = ['SortAscending', 'SortDescending',
      'Edit', 'Delete', 'Save', 'Cancel', 'AddRow',
      { text: 'Add Column', target: '.e-headercontent', id: 'addColumn' },
      { text: 'Freeze Column', target: '.e-headercontent', id: 'freeze' },
      { text: 'Filter', target: '.e-headercontent', id: 'filter' },
      { text: 'Multi Sort', target: '.e-headercontent', id: 'multi_sort' },
      { text: 'Multi Select', target: '.e-gridcontent', id: 'multi_select' },
      { text: 'Copy Row', target: '.e-gridcontent', id: 'copy_row' },
     
    ];
  
  }

  contextMenuClick(args?: MenuEventArgs) {
    let lenght = 0;
    // Filter on/off 
    if (args.item.id == 'filter') {
      this.isAllow = !this.isAllow;
    }

    // Freeze on/off
    if (args.item.id == 'freeze' && this.frozenColumns !== this.columnIndex + 1) {
      this.frozenColumns =this.columnIndex + 1;
      this.isFreeze = true;
    } else if (args.item.id == 'freeze'  && this.frozenColumns == this.columnIndex + 1) {
      this.isFreeze = false;
      this.frozenColumns = 0;
    }


    // Multi Select on/off
    if (args.item.id == 'multi_select' && !this.isAllSelected) {
     
      this.data.forEach((e: any) => {
        lenght = lenght + 1;
        lenght = lenght + e.subtasks.length;

        e.subtasks.forEach(element => {
          if (element.subtasks) {
            lenght = lenght + element.subtasks.length;
            element.subtasks.forEach(e1 => {
              console.log('e1 =>', e1);

              if (e1.subtasks) {
                lenght = lenght + e1.subtasks.length;

              }
            });
          }
        });
      });
      this.treeGridObj.selectRows([...Array(lenght).keys()]);
      this.isAllSelected = true;
    } else if (args.item.id == 'multi_select' && this.isAllSelected) {
      this.isAllSelected = false;
      this.treeGridObj.selectRows([-1])
    }
    
    // Multi Sort on/off
    if (args.item.id == 'multi_sort' && !this.isMultiSort) {
      this.isMultiSort = true;
      this.initialSort = {
        columns: [
          { field: 'taskID', direction: 'Ascending' },
          { field: 'taskName', direction: 'Ascending' },
          { field: 'startDate', direction: 'Ascending' },
          { field: 'endDate', direction: 'Ascending' },
          { field: 'priority', direction: 'Ascending' },
          { field: 'approved', direction: 'Ascending' },
          { field: 'progress', direction: 'Ascending' },
          { field: 'duration', direction: 'Ascending' }]
      };
    }else if (args.item.id == 'multi_sort' && this.isMultiSort){
      this.isMultiSort = false;
     this.isSort = false;
    }

    // copy row 
    if (args.item.id == 'copy_row' && !this.isSelectRow) {
      this.isSelectRow = true;
      this.copyObj = this.treeGridObj.copy();
      this.selectionOptions = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box'};
      this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' };
    } else if (args.item.id == 'copy_row' && this.isSelectRow) {
      this.isSelectRow = false;
      this.selectionOptions = { type: 'Multiple'};
      this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    }
    
    // add column
    if(args.item.id == 'addColumn'){
      this.showColumn=true;
      this.contextMenuItems =  ['SortAscending', 'SortDescending',
      'Edit', 'Delete', 'Save', 'Cancel', 'AddRow',
      { text: 'Remove Column', target: '.e-headercontent', id: 'removeColumn' },
      { text: 'Freeze Column', target: '.e-headercontent', id: 'freeze' },
      { text: 'Filter', target: '.e-headercontent', id: 'filter' },
      { text: 'Multi Sort', target: '.e-headercontent', id: 'multi_sort' },
      { text: 'Multi Select', target: '.e-gridcontent', id: 'multi_select' },
      { text: 'Copy Row', target: '.e-gridcontent', id: 'copy_row' }
    ];
    }

    // remove column
    if(args.item.id == 'removeColumn'){
      this.showColumn=false;
      this.contextMenuItems =  ['SortAscending', 'SortDescending',
      'Edit', 'Delete', 'Save', 'Cancel', 'AddRow',
      { text: 'Add Column', target: '.e-headercontent', id: 'addColumn' },
      { text: 'Freeze Column', target: '.e-headercontent', id: 'freeze' },
      { text: 'Filter', target: '.e-headercontent', id: 'filter' },
      { text: 'Multi Sort', target: '.e-headercontent', id: 'multi_sort' },
      { text: 'Multi Select', target: '.e-gridcontent', id: 'multi_select' },
      { text: 'Copy Row', target: '.e-gridcontent', id: 'copy_row' }
    ];
    }
  }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs)  {
    console.log('arg',arg);
    
  this.columnIndex = arg['column'].index; 
  this.isSort = true;
  this.selectionOptions = { type: 'Multiple'};
  this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
  }

}
