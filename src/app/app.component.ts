import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'baseCDRpro';
  public gridApi: any;
  public gridColumnApi: any;
  public columnDefs: any;
  public calls: object;

  constructor(private http: HttpClient){
    //Auto reload every 5 minutes
    interval(300000).subscribe(val => {window.location.reload()});

    this.http.get('http://localhost/testcdr/cdrdb.php').subscribe(data => {
    this.calls = Object(data);
    }, error => console.error(error));

    this.columnDefs = [
      // column definition configured to use a date filter
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 60
      },
      {
        headerName:"Fecha",
        field: "calldate",
        sortable: true,
        resizable: true,
        filter: "agDateColumnFilter",
        // add extra parameters for the date filter
        filterParams: {
          // provide comparator function
          comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
            const dateAsString = cellValue;

            if (dateAsString == null) {
                return 0;
            }

            // In the example application, dates are stored as dd/mm/yyyy
            // We create a Date object for comparison against the filter date
            /*
            const dateParts = dateAsString.split('-');
            const day = Number(dateParts[2].split(' ')[0]);
            const month = Number(dateParts[1]);
            const year = Number(dateParts[0]);
            const cellDate = new Date(year, month, day);
            */
            const cellDate = new Date(dateAsString);
            console.log(filterLocalDateAtMidnight, cellDate.setHours(0,0,0,0))
            // Now that both parameters are Date objects, we can compare
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
          }
        }
      },
      {
        headerName:"Nombre",
        field:"cnam",
        sortable: true,
        resizable: true,  
        filter: true 
      },
      {
        headerName:"Origen",
        field:"src",
        width: 100,
        sortable: true,
        resizable: true,  
        filter: true  
      },
      {
        headerName:"Destino",
        field:"dst",
        width: 100,
        sortable: true,
        resizable: true,  
        filter: true 
      },
      {
        headerName:"Canal de Origen",
        field:"channel",
        width: 160,
        sortable: true,
        resizable: true,  
        filter: true  
      },
      {
        headerName:"Canal de Destino",
        field:"dstchannel",
        width: 160,
        sortable: true,
        resizable: true,  
        filter: true 
      },
      {
        headerName:"Estatus",
        field:"disposition",
        width: 125,
        sortable: true,
        resizable: true,  
        filter: true  
      },
      {
        headerName:"Duración (s)",
        field:"duration",
        width: 140,
        sortable: true,
        resizable: true,  
        filter: "agNumberColumnFilter" 
      },
      {
        headerName:"Argumento",
        field:"lastdata",
        width: 130,
        sortable: true,
        resizable: true,  
        filter: true  
      },
      {
        headerName:"ID Único",
        field:"uniqueid",
        width: 150,
        sortable: true,
        resizable: true,  
        filter: "agNumberColumnFilter"  
      },
    ]
  }
  onGridReady(params:any){
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData(Object(this.calls).reverse());
  }
}
