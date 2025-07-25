import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
const API = import.meta.env.VITE_API_URL;


const Userpage = () => {
  const [summary, setSummary] = useState({ total: 0, paid: 0, unpaid: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get( `${API}/members/summary`);
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };

    fetchSummary();
  }, []);

  const { total: totalUsers, paid: paidUsers, unpaid: unpaidUsers } = summary;

  const pieData = [
    { name: 'Paid', value: paidUsers },
    { name: 'Unpaid', value: unpaidUsers },
  ];

  const COLORS = ['#4caf50', '#f44336'];
 const { username } = useAuth();
  const AnimatedTypography = motion(Typography);

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
     <AnimatedTypography
      variant="h4"
      gutterBottom
      sx={{ color: '#ebe0e0ff' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      Hello{username ? `, ${username}` : ''}!
    </AnimatedTypography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#8c8b8bff' }}>
        Track your gym members and their payment status. Go digital — skip the register!
      </Typography>

      <Grid container spacing={3} my={3}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              borderTop: '4px solid #8B0000',
            }}
          >
            <Typography variant="h6">Total Members</Typography>
            <Typography variant="h3" sx={{ color: '#B2ACAC' }}>{totalUsers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              borderTop: '4px solid #8B0000'
            }}
          >
            <Typography variant="h6" mb={2}>
              Payment Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: '#8B0000',
                    color: '#fff',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Userpage;
