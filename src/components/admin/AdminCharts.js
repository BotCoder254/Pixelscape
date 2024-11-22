import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

export function ActivityChart({ data }) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth={1}
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Text fontSize="lg" fontWeight="semibold" mb={4}>Activity Overview</Text>
      <Box height="300px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="questions" stroke="#3182CE" name="Questions" />
            <Line type="monotone" dataKey="answers" stroke="#38A169" name="Answers" />
            <Line type="monotone" dataKey="users" stroke="#DD6B20" name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
} 