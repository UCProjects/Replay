import { ExpandMoreOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { PropsWithChildren, ReactNode, useState } from 'react';

export type ExpandProps = {
  initialState: boolean;
  title?: ReactNode;
};

export default function Expand({
  children = undefined,
  initialState,
  title = undefined,
}: PropsWithChildren<ExpandProps>): ReactNode {
  const [open, setOpen] = useState(initialState);
  return (
    <Accordion
      disableGutters
      expanded={open}
      onChange={(_event, expanded) => {
        setOpen(expanded);
      }}
      sx={{
        padding: 0,
        backgroundColor: 'inherit',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreOutlined />}
        sx={{
          minHeight: 0,
          padding: 0,
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
        }}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: '1px dashed white',
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
