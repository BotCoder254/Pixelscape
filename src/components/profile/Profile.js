import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  Avatar,
  Textarea,
  Divider,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';

export default function Profile() {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.displayName || '',
    email: currentUser?.email || '',
    bio: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setLoading(true);
        await updateUserProfile({ avatar: file });
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
          status: "success",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updates = {
        username: formData.username,
        bio: formData.bio,
      };
      
      await updateUserProfile(updates);
      
      if (formData.email !== currentUser.email) {
        await updateUserEmail(formData.email);
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
      });
      return;
    }
    
    try {
      setLoading(true);
      await updateUserPassword(newPassword);
      setIsChangePasswordOpen(false);
      toast({
        title: "Success",
        description: "Password updated successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      maxW="2xl" 
      mx="auto" 
      mt={8} 
      p={8} 
      borderWidth={1} 
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="lg"
    >
      <VStack spacing={8}>
        <Box position="relative">
          <Avatar
            size="2xl"
            src={currentUser?.photoURL}
            name={currentUser?.displayName}
          />
          <IconButton
            aria-label="Change profile picture"
            icon={<FaCamera />}
            size="sm"
            colorScheme="blue"
            rounded="full"
            position="absolute"
            bottom="0"
            right="0"
            onClick={handleAvatarClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </Box>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                disabled={loading}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Update Profile
            </Button>
          </VStack>
        </form>

        <Divider />

        <Button
          colorScheme="gray"
          width="full"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          Change Password
        </Button>
      </VStack>

      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                width="full"
                onClick={handlePasswordChange}
                isLoading={loading}
              >
                Update Password
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 