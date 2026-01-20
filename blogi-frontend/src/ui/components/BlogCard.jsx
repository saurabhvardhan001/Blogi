import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Chip, Stack } from '@mui/material';

export default function BlogCard({ item, onClick }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="h6" gutterBottom noWrap>{item.metaTitle || item.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
            {item.metaDescription}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(item.keywords || []).slice(0, 3).map((k, i) => <Chip key={i} label={k} size="small" />)}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}