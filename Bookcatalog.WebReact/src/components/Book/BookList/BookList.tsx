import { SyntheticEvent, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  MRT_Row,
  MRT_TableOptions,
} from 'material-react-table';
import { getApiUrl } from 'config/url';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { Box, IconButton, MenuItem, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategorySelection from 'components/Category/CategorySelection';

type Book = {
  id: number,
  title: string,
  author: string,
  category: Category,
  note: string
}

type Category = {
  id: string,
  name: string
}

type CategoryItem = {
  label: string,
  value: string
}

type BookApiResponse = {
  items: Array<Book>;
  metaData: {
    totalCount: number;
  };
};

type CategoryApiResponse = {
  items: Array<Category>;
  metaData: {
    totalCount: number;
  };
};

const BookList = () => {  
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('0');


  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });  
  
  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { items = [], metaData } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<BookApiResponse>({
    queryKey: [
      'table-data',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const getBooksUrl = new URL(
        'book', getApiUrl(),
      );
    
      // URL e.g. api/book?PageNumber=0&pageSize=10&title=long&author=nick&globalFilter=&OrderBy=author+asc

      getBooksUrl.searchParams.set('pageNumber', `${pagination.pageIndex}`);
      getBooksUrl.searchParams.set('pageSize', `${pagination.pageSize}`);
      
      columnFilters.forEach((cf) => {
        if(cf.id === 'title'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            getBooksUrl.searchParams.set('title', cf.value)
          }
        }
        else if(cf.id === 'author'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            getBooksUrl.searchParams.set('author', cf.value)
          }
        }
        else if(cf.id === 'category.name'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            getBooksUrl.searchParams.set('category', cf.value)
          }
        }
        else if(cf.id === 'note'){
          if(cf.value !== '' && typeof cf.value === 'string'){
            getBooksUrl.searchParams.set('note', cf.value)
          }
        }
      })

      if (sorting && sorting.length > 0) {
        let showDescAsc = sorting[0].desc ? "desc" : "asc";
        getBooksUrl.searchParams.set('orderBy', `${sorting[0].id}` + " " + showDescAsc);
      }

      const response = await fetch(getBooksUrl.href);
      const json = (await response.json()) as BookApiResponse;
      return json;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const onSelectCategory = (selectedCategory: string): void => {
    //console.log('onSelectCategory => ' + selectedCategory);
    setSelectedCategory(selectedCategory);
  }

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<Book>['onEditingRowSave'] = async ({
    values,
    table
  }) => {
      console.log("handleSaveUser=> " + selectedCategory);
  };

  const fetchCategories = async (): Promise<Array<CategoryItem>> => {
    const getCategiriesUrl = new URL(
      'category', getApiUrl(),
    );
    
    const response = await fetch(getCategiriesUrl.href);
    const json = (await response.json()) as CategoryApiResponse;
    let categoryItems: Array<CategoryItem> = json.items.map(c=>{
      return {label: c.name, value: c.id.toString()};
    });

    return categoryItems;
  }

  const fetchMockCategs4 : Array<Category> = [
    {
      id: '1',
      name: 'Književnost na hrvatskom',
    },
    {
      id: '6',
      name: 'Publicistika'
    },
    {
      id: '2',
      name: 'Stručna literatura-engleski',
    }
  ];

  const handleMenuItemClick = (event: any, index: string)=>{
    console.log("event=>" + JSON.stringify(event ?? []));
    console.log("index=>" + JSON.stringify(index ?? ""));
  }

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title', 
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.title,
          helperText: validationErrors?.title,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              title: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        }
      },
      {
        accessorKey: 'author',
        header: 'Author',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.author,
          helperText: validationErrors?.author,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              author: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        }
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
        Edit: ({ cell, column, row, table }) => {
          const selectedCategory = row.original.category.id || '0';
          return <CategorySelection onSelectCategory={onSelectCategory} selectedCategory={selectedCategory} inputData={fetchMockCategs4} />;
        
          
        },
        /* editVariant: 'select',
        editSelectOptions: fetchMockCategs2,
        muiEditTextFieldProps: {
          children: fetchMockCategs2.map(item => <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>),
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        }, */
      },
      {
        accessorKey: 'note',
        header: 'Note',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.note,
          helperText: validationErrors?.note,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              note: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        }
      }
    ],
    [],
  );

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Book>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      //deleteUser(row.original.id);
    }
  };
  
  const table = useMaterialReactTable({
    columns,
    data: items,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal', 
    enableEditing: true,
    getRowId: (row) => row.id?.toString(),
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,

    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    rowCount: metaData?.totalCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

    return <MaterialReactTable table={table} />;
}

const queryClient = new QueryClient();

const BookListQueryProvider = () => (
  //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <QueryClientProvider client={queryClient}>
    <BookList />
  </QueryClientProvider>
);

export default BookListQueryProvider;