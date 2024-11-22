import { useState } from 'react';
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Textarea,
  useDisclosure,
  Select,
  useToast
} from '@chakra-ui/react';
import { FiFlag } from 'react-icons/fi';
import { useReports } from '../../hooks/useReports';
import { useAuth } from '../../contexts/AuthContext';

export default function ReportButton({ itemId, itemType, contentPreview }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const { createReport, loading } = useReports();
  const { currentUser } = useAuth();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!reason || !details.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason and details",
        status: "error",
        duration: 3000,
      });
      return;
    }

    await createReport({
      itemId,
      itemType,
      reason,
      details: details.trim(),
      reporterId: currentUser.uid,
      reporterName: currentUser.displayName,
      contentPreview
    });

    onClose();
    setReason('');
    setDetails('');
  };

  return (
    <>
      <IconButton
        icon={<FiFlag />}
        variant="ghost"
        size="sm"
        aria-label="Report"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={6}>
              <Select
                placeholder="Select reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="spam">Spam</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="harassment">Harassment</option>
                <option value="other">Other</option>
              </Select>

              <Textarea
                placeholder="Provide details about your report..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <Button
                colorScheme="red"
                width="full"
                onClick={handleSubmit}
                isLoading={loading}
              >
                Submit Report
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 