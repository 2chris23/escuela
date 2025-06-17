import { ReactElement } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  BarChart,
  BarPlot,
  ChartsReferenceLine,
  ChartsXAxis,
  ChartsYAxis,
}
from '@mui/x-charts/BarChart';
import { AxisConfig } from '@mui/x-charts/models';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import Image from '@/components/base/Image';
import IconifyIcon from '@/components/base/IconifyIcon';
import salesBanner from 'assets/sales/sales-banner.png';

const salesChartData = [
  {
    data: [2, 5.5, 2, 8.5, 1.5, 5],
    label: 'Series A',
    area: true,
    showMark: false,
    color: '#6B7280',
    curve: 'natural',
  },
  {
    data: [7, 8, 5, 10, 8, 12],
    label: 'Series B',
    area: true,
    showMark: false,
    color: '#1D3048',
    curve: 'natural',
  },
];

const bars = [
  {
    data: [1, 2, 3, 4, 5, 6, 7],
    label: 'Sales',
    color: '#099AD6',
  },
];
const xAxis: AxisConfig[] = [
  {
    scaleType: 'band',
    data: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    tickLabelInterval: (i) => i % 2 === 0,
  },
];

const scatterData = [
  {
    x: 100,
    y: 200,
    id: 'A',
  },
  {
    x: 120,
    y: 100,
    id: 'B',
  },
  {
    x: 190,
    y: 250,
    id: 'C',
  },
  {
    x: 240,
    y: 100,
    id: 'D',
  },
  {
    x: 130,
    y: 190,
    id: 'E',
  },
];

const pieData = [
  {
    id: 0,
    value: 10,
    label: 'series A',
    color: '#EA6448',
  },
  {
    id: 1,
    value: 15,
    label: 'series B',
    color: '#1BAFAD',
  },
  {
    id: 2,
    value: 20,
    label: 'series C',
    color: '#099AD6',
  },
];

const Sales = (): ReactElement => {
  const theme = useTheme();

  return (
    <Grid container spacing={3.75} pt={1.25}>
      <Grid item xs={12} md={7}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          bgcolor="primary.main"
          p={{ xs: 2.5, sm: 3.75 }}
          borderRadius={2.5}
          overflow="hidden"
        >
          <Stack gap={{ xs: 2.5, sm: 3.75 }} color="common.white">
            <Typography variant="h4" fontWeight={500} maxWidth={{ sm: 250 }}>
              Welcome back, John Doe!
            </Typography>
            <Typography variant="body1" maxWidth={{ sm: 300 }}>
              You have done 68% more sales today. Check your new badge in your profile.
            </Typography>
            <Button variant="contained" sx={{ maxWidth: 120, bgcolor: 'common.white' }}>
              Go to profile
            </Button>
          </Stack>
          <Box display={{ xs: 'none', sm: 'block' }} width={{ sm: 0.5 }}>
            <Image src={salesBanner} alt="Sales banner" width={1} />
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={5}>
        <Stack
          bgcolor="background.paper"
          p={{ xs: 2.5, sm: 3.75 }}
          borderRadius={2.5}
          gap={{ xs: 2.5, sm: 3.75 }}
        >
          <Typography variant="h5">Statistics</Typography>
          <Box height={190}>
            <LineChart
              series={salesChartData}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3, 4, 5] }]}
              sx={{
                [`.MuiLineElement-root, .MuiMarkElement-root`]: {
                  strokeWidth: 2,
                },
                
                [`.MuiAxis-root .MuiAxis-line`]: {
                  stroke: theme.palette.divider,
                  strokeWidth: 1,
                },
                
                [`.MuiAxis-root .MuiAxis-tick`]: {
                  stroke: theme.palette.divider,
                  strokeWidth: 1,
                },
                
                [`.MuiAxis-root .MuiAxis-tickLabel`]: {
                  fill: theme.palette.text.secondary,
                },
                
                [`.MuiChartsLegend-root`]: {
                  direction: 'row',
                  justifyContent: 'center',
                  top: '!important',
                  left: '!important',
                  bottom: '!important',
                  paddingBottom: '10px',
                },
              }}
            />
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={7}>
        <Stack
          bgcolor="background.paper"
          p={{ xs: 2.5, sm: 3.75 }}
          borderRadius={2.5}
          gap={{ xs: 2.5, sm: 3.75 }}
        >
          <Typography variant="h5">Daily Sales</Typography>
          <Box height={250}>
            <BarChart
              series={bars}
              xAxis={xAxis}
              sx={{
                [`.MuiAxis-root .MuiAxis-line`]: {
                  stroke: theme.palette.divider,
                  strokeWidth: 1,
                },
                [`.MuiAxis-root .MuiAxis-tick`]: {
                  stroke: theme.palette.divider,
                  strokeWidth: 1,
                },
                [`.MuiAxis-root .MuiAxis-tickLabel`]: {
                  fill: theme.palette.text.secondary,
                },
              }}
            >
              <BarPlot />
              <ChartsXAxis axisId="x-axis-id" />
              <ChartsYAxis axisId="y-axis-id" />
              <ChartsReferenceLine
                x={4}
                label="middle"
                lineStyle={{ stroke: 'red', strokeDasharray: '3 3' }}
              />
            </BarChart>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={5}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          bgcolor="background.paper"
          p={{ xs: 2.5, sm: 3.75 }}
          borderRadius={2.5}
          gap={{ xs: 2.5, sm: 3.75 }}
        >
          <Stack gap={1.25} flex={1}>
            <Typography variant="h5">Monthly Sales</Typography>
            <Box flex={1} display="flex" alignItems="center" justifyContent="center">
              <PieChart
                series={[{ data: pieData, innerRadius: 80, outerRadius: 100, paddingAngle: 5 }]}
                height={200}
                sx={{
                  [`.MuiChartsLegend-root`]: {
                    direction: 'row',
                    justifyContent: 'center',
                    top: '!important',
                    left: '!important',
                    bottom: '!important',
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack gap={1.25} flex={1}>
            <Typography variant="h5">Goals</Typography>
            <Stack
              flex={1}
              justifyContent="center"
              alignItems="center"
              sx={{ width: 1, height: 1, position: 'relative' }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                size={160}
                sx={{
                  color: theme.palette.grey[200],
                  position: 'absolute',
                }}
              />
              <CircularProgress
                variant="determinate"
                value={68}
                size={160}
                sx={{ color: theme.palette.primary.main }}
              />
              <Stack position="absolute" alignItems="center" gap={0.5}>
                <Typography variant="h4">68%</Typography>
                <Typography variant="subtitle1">Goal</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack
          bgcolor="background.paper"
          p={{ xs: 2.5, sm: 3.75 }}
          borderRadius={2.5}
          gap={{ xs: 2.5, sm: 3.75 }}
        >
          <Typography variant="h5">Customers</Typography>
          <Box height={300}>
            <ScatterChart
              series={[
                {
                  label: 'Customer 1',
                  data: scatterData.map((s) => ({ x: s.x, y: s.y, id: s.id })),
                },
              ]}
              height={300}
            />
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          bgcolor="background.paper"
          p={{ xs: 2.5, sm: 3.75 }}
          borderRadius={2.5}
          gap={{ xs: 2.5, sm: 3.75 }}
        >
          <Stack flex={1} gap={1.25}>
            <Typography variant="h5">Performance</Typography>
            <Box height={160}>
              <Gauge
                value={70}
                startAngle={-110}
                endAngle={110}
                sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 24,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#52D9AA',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack flex={1} gap={1.25}>
            <Typography variant="h5">Traffic</Typography>
            <Box height={160}>
              <Gauge
                value={45}
                startAngle={-110}
                endAngle={110}
                sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 24,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#FCD34D',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack flex={1} gap={1.25}>
            <Typography variant="h5">Client</Typography>
            <Box height={160}>
              <Gauge
                value={85}
                startAngle={-110}
                endAngle={110}
                sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 24,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#60A5FA',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Sales; 