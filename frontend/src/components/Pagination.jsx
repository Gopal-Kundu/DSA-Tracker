import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/questionSlice';

// Dark Theme for MUI component matching application aesthetic
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffa116',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
});

const PaginationRounded = ({ onPageChange }) => {
  const dispatch = useDispatch();
  const { currentPage, totalPages, totalQuestions, loading } = useSelector(
    (state) => state.questions
  );

  if (totalQuestions === 0 || totalPages <= 1) {
    return null;
  }

  const handlePageChange = (event, newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !loading) {
      dispatch(setCurrentPage(newPage));
      if (onPageChange) {
        onPageChange(newPage);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="pagination-container" style={{ justifyContent: 'center', margin: '1.5rem 0' }}>
        <Stack spacing={2} alignItems="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            disabled={loading}
            size="medium"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--border-color)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'var(--border-hover)',
                  color: 'var(--color-text-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-accent)',
                  color: '#000',
                  fontWeight: '700',
                  borderColor: 'var(--color-accent)',
                  '&:hover': {
                    backgroundColor: 'var(--color-accent-hover)',
                  },
                },
              },
            }}
          />
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default React.memo(PaginationRounded);
