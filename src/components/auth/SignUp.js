import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Heading,
  FormHelperText,
  Box,
  useColorModeValue,
  Alert,
  AlertIcon,
  Progress
} from '@chakra-ui/react';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from './AuthLayout';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength === 0) return 'red.500';
    if (strength === 1) return 'orange.500';
    if (strength === 2) return 'yellow.500';
    if (strength === 3) return 'blue.500';
    return 'green.500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        position: "top"
      });
      return;
    }

    if (getPasswordStrength(formData.password) < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        status: "warning",
        duration: 3000,
        position: "top"
      });
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.username);
      toast({
        title: "Account created successfully",
        description: "Welcome to our community!",
        status: "success",
        duration: 3000,
        position: "top"
      });
      navigate('/');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      navigate('/');
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

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <AuthLayout>
      <VStack spacing={8} align="stretch">
        <VStack spacing={2} align="center">
          <Heading size="xl">Create Account</Heading>
          <Text color="gray.500">
            Join our community of developers
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
          Sign up with Google
        </Button>

        <HStack>
          <Divider />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
            or sign up with email
          </Text>
          <Divider />
        </HStack>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a username"
                size="lg"
                disabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
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
              {formData.password && (
                <Box mt={2}>
                  <Progress
                    value={(passwordStrength / 4) * 100}
                    size="sm"
                    colorScheme={getPasswordStrengthColor(passwordStrength)}
                  />
                  <FormHelperText>
                    Password strength: {
                      passwordStrength === 0 ? "Very weak" :
                      passwordStrength === 1 ? "Weak" :
                      passwordStrength === 2 ? "Medium" :
                      passwordStrength === 3 ? "Strong" :
                      "Very strong"
                    }
                  </FormHelperText>
                </Box>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <InputRightElement>
                  <IconButton
                    icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {formData.password && formData.confirmPassword && 
              formData.password !== formData.confirmPassword && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  Passwords do not match
                </Alert>
            )}

            <Button 
              type="submit" 
              colorScheme="blue" 
              size="lg"
              width="full"
              isLoading={loading}
              loadingText="Creating account..."
            >
              Create Account
            </Button>
          </VStack>
        </form>

        <Text textAlign="center">
          Already have an account?{' '}
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
