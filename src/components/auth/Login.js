import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  Divider,
  HStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Heading
} from '@chakra-ui/react';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from './AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Error signing in with Google",
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
          <Heading size="xl">Welcome Back</Heading>
          <Text color="gray.500">
            Sign in to access your account
          </Text>
        </VStack>

        <Button
          leftIcon={<FaGoogle />}
          onClick={handleGoogleSignIn}
          size="lg"
          colorScheme="red"
          variant="outline"
          isLoading={loading}
          w="full"
        >
          Continue with Google
        </Button>

        <HStack>
          <Divider />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
            or sign in with email
          </Text>
          <Divider />
        </HStack>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                disabled={loading}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="blue" 
              size="lg"
              width="full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <VStack spacing={4} pt={4}>
          <Link 
            as={RouterLink} 
            to="/reset-password"
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Forgot your password?
          </Link>

          <Text>
            Don't have an account?{' '}
            <Link
              as={RouterLink}
              to="/signup"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              Sign up
            </Link>
          </Text>
        </VStack>
      </VStack>
    </AuthLayout>
  );
} 
