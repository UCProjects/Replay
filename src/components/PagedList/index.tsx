import {
  TablePagination,
  TablePaginationProps,
} from '@mui/material';
import {
  ReactNode,
  createElement,
  useCallback,
  useMemo,
  useState,
  JSX,
  ComponentClass,
  ComponentProps,
  JSXElementConstructor,
  ElementType,
  useEffect,
} from 'react';

type BaseElement = keyof JSX.IntrinsicElements;

export type Component =
  | ElementType
  | JSXElementConstructor<ComponentProps<BaseElement>>
  | ComponentClass<ComponentProps<BaseElement>>
  | BaseElement;

export type PagedListProps<C extends Component> = {
  component: C;
  componentProps?: Omit<ComponentProps<C>, 'children'>;
  emptyMessage?: ReactNode;
  items: ReactNode[];
  itemsPerPage?: TablePaginationProps['rowsPerPage'];
  itemsPerPageOptions?: TablePaginationProps['rowsPerPageOptions'];
  // paginateBottom?: boolean;
  // paginateTop?: boolean;
  // paginateTopRef?: MutableRefObject<T>;
  resetPage?: unknown;
};

export function PagedList<C extends Component>({
  component,
  componentProps = undefined,
  emptyMessage = undefined,
  items,
  itemsPerPage = -1,
  itemsPerPageOptions = [],
  // paginateBottom = true,
  // paginateTop = false,
  // paginateTopRef = undefined,
  resetPage = undefined,
}: PagedListProps<C>): ReactNode {
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [rowsPerPageOptions] = useState(itemsPerPageOptions);
  const [page, setPage] = useState(0);

  useEffect(
    () => setPage(0),
    [
      items,
      resetPage,
    ],
  );

  const handlePageChange: TablePaginationProps['onPageChange'] = useCallback(
    (_event, newPage) => setPage(newPage),
    [],
  );

  const handleSelectRows: NonNullable<TablePaginationProps['onRowsPerPageChange']> = useCallback(
    (event) => {
      const num = Number(event.target.value);
      if (!rowsPerPageOptions?.includes(num)) return;
      setRowsPerPage(num);
    },
    [rowsPerPageOptions],
  );

  const itemSlice = useMemo(() => {
    const start = page * rowsPerPage;
    const end = rowsPerPage === -1 ? items.length : start + rowsPerPage;
    return items.slice(start, end);
  }, [
    items,
    page,
    rowsPerPage,
  ]);

  const content = useMemo(
    () => (items.length ? itemSlice : emptyMessage),
    [
      emptyMessage,
      items.length,
      itemSlice,
    ],
  );

  const container = createElement(component, componentProps, content);

  const count = useMemo(() => items.length, [items.length]);

  return (
    <>
      {container}
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleSelectRows}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </>
  );
}
