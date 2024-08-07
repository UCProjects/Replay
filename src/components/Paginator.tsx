import {
  Portal,
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
  MutableRefObject,
} from 'react';

type BaseElement = keyof JSX.IntrinsicElements;

export type Component =
  | ElementType
  | JSXElementConstructor<ComponentProps<BaseElement>>
  | ComponentClass<ComponentProps<BaseElement>>
  | BaseElement;

export type PaginatorProps<C extends Component, T extends Element = HTMLElement> = {
  component: C;
  componentProps?: Omit<ComponentProps<C>, 'children'>;
  emptyMessage?: ReactNode;
  items: ReactNode[];
  itemsPerPage?: TablePaginationProps['rowsPerPage'];
  itemsPerPageOptions?: TablePaginationProps['rowsPerPageOptions'];
  // paginateBottom?: boolean;
  paginateTop?: boolean;
  paginateTopRef?: MutableRefObject<T | null>;
  resetPage?: unknown;
};

export function Paginator<C extends Component>({
  component,
  componentProps = undefined,
  emptyMessage = undefined,
  items,
  itemsPerPage = 20,
  itemsPerPageOptions = [itemsPerPage],
  // paginateBottom = true,
  paginateTop = false,
  paginateTopRef = undefined,
  resetPage = undefined,
}: PaginatorProps<C>): ReactNode {
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
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
      setRowsPerPage(num);
    },
    [],
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

  return (
    <>
      {paginateTop || paginateTopRef ? (
        <Portal
          container={() => paginateTopRef?.current ?? null}
          disablePortal={!paginateTopRef}
        >
          <TablePagination
            component="div"
            count={items.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleSelectRows}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={itemsPerPageOptions}
          />
        </Portal>
      ) : null}
      {container}
      <TablePagination
        component="div"
        count={items.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleSelectRows}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={itemsPerPageOptions}
      />
    </>
  );
}
