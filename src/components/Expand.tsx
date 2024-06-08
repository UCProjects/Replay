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
  // We can't change the state dynamically using "default"
  const [defaultExpanded] = useState(initialState);
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      square
      sx={{
        backgroundColor: 'inherit',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreOutlined />}
        sx={{
          alignContent: 'center',
          minHeight: 0,
          padding: 0,
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            position: 'absolute',
            left: 5,
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
