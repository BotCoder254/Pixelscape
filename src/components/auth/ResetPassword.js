import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  useToast,
  Heading,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import AuthLayout from './AuthLayout';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        status: "error",
        duration: 3000,
        position: "top"
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      toast({
        title: "Email Sent",
        description: "Check your inbox for password reset instructions",
        status: "success",
        duration: 5000,
        position: "top"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <VStack spacing={8} align="stretch">
        <VStack spacing={2} align="center">
          <Icon as={FiMail} boxSize={10} color="blue.500" />
          <Heading size="xl">Reset Password</Heading>
          <Text color="gray.500" textAlign="center">
            Enter your email address and we'll send you instructions to reset your password
          </Text>
        </VStack>

        {success ? (
          <Box>
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="lg"
              p={6}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Reset Link Sent!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                We've sent password reset instructions to your email address. Please check your inbox.
              </AlertDescription>
            </Alert>

            <VStack mt={6} spacing={4}>
              <Text>Didn't receive the email?</Text>
              <Button
                variant="outline"
                colorScheme="blue"
                width="full"
                onClick={handleSubmit}
                isLoading={loading}
              >
                Resend Email
              </Button>
            </VStack>
          </Box>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  disabled={loading}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={loading}
                loadingText="Sending..."
              >
                Send Reset Link
              </Button>
            </VStack>
          </form>
        )}

        <HStack spacing={4} justify="center" pt={4}>
          <Link
            as={RouterLink}
            to="/login"
            color="blue.500"
            display="flex"
            alignItems="center"
          >
            <Icon as={FiArrowLeft} mr={2} />
            Back to Login
          </Link>
        </HStack>

        <Text textAlign="center" fontSize="sm" color="gray.500">
          Remember your password?{' '}
          <Link
            as={RouterLink}
            to="/login"
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Sign in
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
} 