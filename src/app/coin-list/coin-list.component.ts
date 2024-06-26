import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CoinService } from '../services/coin.service';
import { ListCoin } from '../models/list-coin.model';

enum FilterField {
  Name,
  Symbol,
}

type AppliedFilters = {
  [e in FilterField]: string;
};

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss',
})
export class CoinListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  appliedFilters: AppliedFilters = {
    [FilterField.Name]: '',
    [FilterField.Symbol]: '',
  };

  listLoading: boolean;
  listLoadError: boolean;

  readonly coinListDataSource = new MatTableDataSource<ListCoin>();
  readonly displayedColumns = ['name', 'symbol'];
  readonly FilterField = FilterField;
  readonly filterChange$ = new Subject<void>();

  private coinList: ListCoin[];

  constructor(
    private coinService: CoinService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.listLoading = true;
    this.coinService.getCoinList().subscribe({
      next: (coins) => {
        this.coinList = coins;
        this.coinListDataSource.data = this.coinList;
        this.listLoading = false;
      },
      error: () => {
        this.listLoadError = true;
        this.listLoading = false;
      }
    });

    this.filterChange$.pipe(debounceTime(300)).subscribe(() => {
      let filteredData: ListCoin[] = this.coinList;

      if (this.appliedFilters?.[FilterField.Name]) {
        filteredData = this.coinList?.filter((c) =>
          c.name
            .toLowerCase()
            .includes(this.appliedFilters[FilterField.Name].toLowerCase()),
        );
      }

      if (this.appliedFilters?.[FilterField.Symbol]) {
        filteredData = filteredData?.filter((c) =>
          c.symbol
            .toLowerCase()
            .includes(this.appliedFilters[FilterField.Symbol].toLowerCase()),
        );
      }

      this.coinListDataSource.data = filteredData;
    });
  }

  ngAfterViewInit() {
    this.coinListDataSource.paginator = this.paginator;
    this.coinListDataSource.sort = this.sort;
  }

  onFilterChange(field: FilterField, value: string) {
    this.appliedFilters[field] = value;
    this.filterChange$.next();
  }

  clearFilter(field: FilterField) {
    this.appliedFilters[field] = '';
    this.filterChange$.next();
  }

  openCoinDetails(coinId: string) {
    this.router.navigate(['coin', coinId]);
  }
}
