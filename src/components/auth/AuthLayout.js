import { Box, Container, VStack, Image, useColorModeValue } from '@chakra-ui/react';

export default function AuthLayout({ children }) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={bgColor} py={12} px={4}>
      <Container maxW="lg">
        <VStack spacing={8}>
          <Image
            src="/logo.png" // Add your logo here
            alt="Logo"
            height="60px"
            fallbackSrc="https://via.placeholder.com/180x60"
          />
          <Box
            w="full"
            bg={cardBgColor}
            boxShadow="lg"
            rounded="lg"
            p={8}
            borderWidth={1}
            borderColor={borderColor}
          >
            {children}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 